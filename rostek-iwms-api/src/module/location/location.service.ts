import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { LocationDto } from "src/dtos/Location.dto";
import { Area } from "src/shemas/area.schema";
import { FilterDataResponse, convertDataResponse } from "src/ultil";
import { FilterQuery, BundleCreate } from "src/ultil/type";
import { Location, STATUS_LOCATION } from "src/shemas/location.schema";
import {
  MissionHistory,
  STATUS_MISSION,
} from "src/shemas/mission_history.schema";
import { AreaConfig } from "src/shemas/areaconfig.schema";
import { Inventory } from "src/shemas/inventory.schema";

const url_dal = "http://127.0.0.1:8080/send_bind";

@Injectable()
export class LocationService {
  constructor(
    @InjectModel(Location.name) private moduleLocation: Model<Location>,
    @InjectModel(Area.name) private modelArea: Model<Area>,
    @InjectModel(MissionHistory.name)
    private modelMissionHistory: Model<MissionHistory>,
    @InjectModel(AreaConfig.name) private modelAreaConfig: Model<AreaConfig>,
    @InjectModel(Inventory.name) private modelInventory: Model<Inventory>,
  ) { }

  async getAll() {
    const data = await this.moduleLocation
      .find()
      .populate("areaId")
      .populate("area_config")
      .populate("inventory");
    return convertDataResponse("OK", data);
  }

  async getUserByFilter(body: FilterQuery) {
    return await FilterDataResponse(body, this.moduleLocation);
  }
  async bundleCreate(body: BundleCreate) {
    try {
      const { locationIds, materials, area: area_code, rackId: areaId } = body;
      const listPromise = locationIds.map((id: string) => {
        return this.moduleLocation.findOneAndUpdate(
          { code: id },
          {
            $set: {
              skus: materials,
              areaId: new Types.ObjectId(areaId),
              area_config: new Types.ObjectId(area_code),
            },
          },
          {
            new: true,
            upsert: true,
          },
        );
      });
      const result = await Promise.all(listPromise);
      return convertDataResponse("Create and Update Success", result);
    } catch (error) {
      throw new HttpException(
        "Error in bundleCreate: " + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    // return await FilterDataResponse(body, this.moduleLocation);
  }
  async getById(id: any) {
    const data = await this.moduleLocation
      .findById(id)
      .populate("areaId")
      .populate("area_config")
      .populate("inventory");
    if (!data) throw new HttpException("Id invalid", HttpStatus.NOT_FOUND);
    return convertDataResponse("Ok", data);
  }
  async getLocationByArea(area: string) {
    const data = await this.moduleLocation
      .find({
        areaId: area,
        // status: { $ne: STATUS_LOCATION.DISABLED },
      })
      .populate("inventory");
    if (!data) throw new HttpException("Id invalid", HttpStatus.NOT_FOUND);
    return convertDataResponse("Ok", data);
  }

  async createAndUpdate(
    { areaId, code, ...data }: LocationDto,
    object_call: any,
  ) {
    const findArea = await this.modelArea.findById(areaId);
    if (!findArea)
      throw new HttpException("Area not found", HttpStatus.NOT_FOUND);

    const { location_code: areaCode } = findArea;
    const listLocationCodes = code.split(",");
    const listItem = [];

    if (data.status == STATUS_LOCATION.DISABLED) {
      data.skus = [];
    } else if (
      data.status == STATUS_LOCATION.AVAILABLE &&
      (!data.skus || data.skus.length === 0)
    ) {
      data.status = STATUS_LOCATION.UNAVAILABLE;
    }

    if (
      data.status == STATUS_LOCATION.UNAVAILABLE ||
      data.status == STATUS_LOCATION.DISABLED
    ) {
      for (let index = 0; index < listLocationCodes.length; index++) {
        const dataUpdate = await this.moduleLocation
          .findOneAndUpdate(
            { code: listLocationCodes[index], areaId },
            { ...data, areaCode, areaId, object_call },
            {
              new: true,
              upsert: true,
            },
          )
          .lean();
        listItem.push(dataUpdate);
      }
    } else {
      for (let index = 0; index < listLocationCodes.length; index++) {
        const dataUpdate = await this.moduleLocation
          .findOneAndUpdate(
            {
              code: listLocationCodes[index],
              areaId,
              status: { $ne: STATUS_LOCATION.DISABLED },
            },
            { ...data, areaCode, areaId, object_call },
            {
              new: true,
              upsert: true,
            },
          )
          .lean();
        listItem.push(dataUpdate);
      }
    }
    return convertDataResponse("Create and Update Success", listItem);
  }

  async createAndUpdateDal(
    { areaId, code, ...data }: LocationDto,
    object_call: any,
  ) {
    const findArea = await this.modelArea.findById(areaId);
    if (!findArea)
      throw new HttpException("Area not found", HttpStatus.NOT_FOUND);

    const { location_code: areaCode } = findArea;

    const locations = code.split(",").map((area_code) => {
      return `${areaCode}#${area_code}`;
    });

    const missionsOnSchedule = await this.modelMissionHistory
      .find({
        $or: [
          { pickup_location: { $in: locations } },
          { return_location: { $in: locations } },
        ],
        current_state: {
          $in: [
            STATUS_MISSION.REGISTERED,
            STATUS_MISSION.PENDING,
            STATUS_MISSION.PROCESSING,
          ],
        },
      })
      .lean();
    if (missionsOnSchedule.length)
      throw new HttpException("Area on mission", HttpStatus.NOT_FOUND);

    const updateDbWarehouse = async () => {
      const listItem = [];
      const listSendLocation = [];
      const listLocationCodes = code.split(",");

      for (let index = 0; index < listLocationCodes.length; index++) {
        const dataUpdate = await this.moduleLocation
          .findOneAndUpdate(
            {
              code: listLocationCodes[index],
              areaId,
              status: { $ne: STATUS_LOCATION.DISABLED },
            },
            { ...data, areaCode, areaId, object_call },
            {
              new: true,
              upsert: true,
            },
          )
          .lean();
        listItem.push(dataUpdate);
        const point = `${areaCode}${listLocationCodes[index]}`;
        listSendLocation.push(point);
      }

      await this.sendDal(`${url_dal}`, {
        list_data: listSendLocation,
        status: data?.status,
      });
      return convertDataResponse("Create and Update Success", listItem);
    };

    const listLocationCodes = code.split(",");

    if (findArea) {
      return await updateDbWarehouse();
    } else {
      if (data.status == STATUS_LOCATION.FILL) {
        const findByLocationWithStatus = await this.moduleLocation
          .find({
            areaId,
            status: STATUS_LOCATION.AVAILABLE,
            skus: { $in: data?.skus || [] },
          })
          .lean();

        if (findByLocationWithStatus) {
          const arrLocation = findByLocationWithStatus.map((item) => item.code);
          const checkExist = listLocationCodes.map((item) =>
            arrLocation.includes(item),
          );

          if (checkExist.length > 0 && !checkExist.includes(false)) {
            const isCorrectSku = findByLocationWithStatus
              .filter((i) => listLocationCodes.includes(i.code))
              .map((item) => {
                return item.skus?.some((sku) => data.skus?.includes(sku));
              });

            if (isCorrectSku.includes(false)) {
              throw new HttpException(
                "Có khu vực không khớp sản phẩm",
                HttpStatus.NOT_FOUND,
              );
            }
            return await updateDbWarehouse();
          } else {
            throw new HttpException(
              "Có khu vực không phù hợp",
              HttpStatus.NOT_FOUND,
            );
          }
        } else {
          throw new HttpException(
            "Không có khu vực phù hợp",
            HttpStatus.NOT_FOUND,
          );
        }
      } else if (data.status == STATUS_LOCATION.AVAILABLE) {
        data.skus = [];
        data.status = STATUS_LOCATION.UNAVAILABLE;
        return await updateDbWarehouse();
      }
      return await updateDbWarehouse();
    }
  }

  async update(data: any, id: string) {
    const dataUpdate = await this.moduleLocation.findByIdAndUpdate(id, data, {
      new: true,
    });
    return convertDataResponse("Update Success", dataUpdate);
  }

  async delete(id: string) {
    const deleteSuccess = await this.moduleLocation.findByIdAndDelete(id);
    if (!deleteSuccess)
      throw new HttpException("Id invalid", HttpStatus.NOT_FOUND);
    return {
      msg: "Delete Location Success",
    };
  }

  async deleteLocation(data: any) {
    const { areaId, code } = data;
    const findArea = await this.modelArea.findById(areaId);
    if (!findArea)
      throw new HttpException("Area not found", HttpStatus.NOT_FOUND);

    const findLocation = await this.moduleLocation
      .find({
        areaId,
        status: STATUS_LOCATION.DISABLED,
        code: { $in: code.split(",") },
      })
      .lean();

    if (findLocation.length > 0)
      throw new HttpException(
        "Có khu vực bị vô hiệu hoá",
        HttpStatus.BAD_REQUEST,
      );

    await this.moduleLocation.deleteMany({
      areaId,
      code: { $in: code.split(",") },
    });

    return {
      msg: "Delete Success",
    };
  }

  async sendDal(url: string, data: any) {
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        return;
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }
}
