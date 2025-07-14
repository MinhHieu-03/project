import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { CallBoxesDto } from "src/dtos/CallBoxes.dto";
import { CallBoxes } from "src/shemas/call_boxes.schema";
import { Model } from "mongoose";
import { FilterDataResponse, convertDataResponse } from "src/ultil";
import { FilterQuery } from "src/ultil/type";
import { isEmpty } from "lodash";
import * as moment from "moment"; // Import Moment.js
import { Location, STATUS_LOCATION } from "src/shemas/location.schema";
import * as systemData from "../../system.json";
import { AREA, Area } from "src/shemas/area.schema";
import { v4 as uuidv4 } from "uuid";
import { removeFields } from "../../ultil/convert_data";
import {
  MissionHistory,
  STATUS_MISSION,
} from "src/shemas/mission_history.schema";
import {
  findDocumentLatestWithDate,
  findDocumentOldestWithDate,
  findDocumentWithInboard,
  findDocumentWithOutboard,
} from "src/ultil/convert_data";

@Injectable()
export class CallBoxesService {
  constructor(
    @InjectModel(CallBoxes.name) private modelCallBoxes: Model<CallBoxes>,
    @InjectModel(Location.name) private modelLocations: Model<Location>,
    @InjectModel(Area.name) private modalArea: Model<Area>,
    @InjectModel(MissionHistory.name)
    private modelMissionHistory: Model<MissionHistory>,
  ) {}

  async getAll() {
    const data = await this.modelCallBoxes.find();
    return convertDataResponse("OK", data);
  }

  async getUserByFilter(body: FilterQuery) {
    return await FilterDataResponse(body, this.modelCallBoxes);
  }

  async checkConnectCallBox() {
    const listCallBoxConnect: any[] = await this.modelCallBoxes.find({
      status_connect: 1,
    });
    const currentDate = moment();
    if (listCallBoxConnect.length > 0) {
      for (let i = 0; i < listCallBoxConnect.length; i++) {
        if (
          moment(listCallBoxConnect[i]?.updatedAt)
            .add(15, "seconds")
            .isBefore(currentDate)
        ) {
          await listCallBoxConnect[i].updateOne({ status_connect: 0 });
        }
      }
    }
  }

  async getById(id: any) {
    const data = await this.modelCallBoxes.findById(id);
    if (!data) throw new HttpException("Id invalid", HttpStatus.NOT_FOUND);
    return convertDataResponse("Ok", data);
  }

  async create(data: CallBoxesDto) {
    const newData = await this.modelCallBoxes.create(data);
    return convertDataResponse("Create Success", newData);
  }
  async update(data: any, id: string) {
    const dataUpdate = await this.modelCallBoxes.findByIdAndUpdate(id, data, {
      new: true,
    });
    return convertDataResponse("Update Success", dataUpdate);
  }

  async updateWithDal(data: any) {
    for (let i = 0; i < data.length; i++) {
      const { gateway_id, deviceId, plc_id } = data[i];
      const findCallBoxes = await this.modelCallBoxes.findOne({
        gateway_id,
        deviceId,
        plc_id,
      });
      if (!findCallBoxes)
        throw new HttpException(
          `Not found call boxes with deviceId : ${deviceId}`,
          HttpStatus.NOT_FOUND,
        );
      await findCallBoxes.updateOne({ status_connect: 1 });
    }
    return {
      msg: "Update Success",
    };
  }

  async checkingCallBox(data) {
    const { gateway_id, plc_id, tasks } = data;
    const { button_id, action } = tasks[0];

    const findCallBoxes = await this.modelCallBoxes
      .findOne({
        gateway_id,
        plc_id,
        deviceId: button_id,
      })
      .lean();
    if (!findCallBoxes)
      throw new HttpException("Not found call boxes", HttpStatus.NOT_FOUND);
    return findCallBoxes;
  }

  async updateMissionWithWarehouseOutput({ locationSuitable, findCallBoxes }) {
    const { location, sectors, call_boxes_code } = findCallBoxes;
    const { name, areaCode, _id } = locationSuitable;
    return this.createMission({
      locationSuitable,
      pickup_location: location,
      return_location: `${areaCode}#${name}`,
      findCallBoxes,
      status: STATUS_MISSION.REGISTERED,
      code: 1,
    });
  }

  async createMission({
    locationSuitable,
    findCallBoxes,
    status,
    code,
    pickup_location,
    return_location,
    isOutArea = true,
  }) {
    const { location, sectors, call_boxes_code } = findCallBoxes;
    const { name, areaCode, _id } = locationSuitable;
    const newMission = await this.modelMissionHistory.create({
      mission_code: `MISSION-${uuidv4()}`,
      pickup_location: !isEmpty(locationSuitable)
        ? pickup_location
        : isOutArea
          ? location
          : "",
      return_location: !isEmpty(locationSuitable)
        ? return_location
        : isOutArea
          ? ""
          : location,
      object_call: call_boxes_code,
      description: !isEmpty(locationSuitable)
        ? ""
        : "Không tìm thấy vị trí trong kho phù hợp",
      sector: sectors,
      call_boxes_id: findCallBoxes._id,
      current_state: !isEmpty(locationSuitable)
        ? status
        : STATUS_MISSION.CANCEL,
      status_list: [
        {
          status: STATUS_MISSION.REGISTERED,
          updateAt: Date.now(),
        },
      ],
    });
    return {
      mission_rcs: newMission?.mission_rcs || 0,
      mission_code: newMission.mission_code || 0,
      pickup_location: newMission.pickup_location,
      sectors,
      return_location: newMission.return_location,
      location_id: _id,
      code,
    };
  }

  checkStatusMissionByCallBox(listMissionByDevice) {
    const isDone =
      !listMissionByDevice ||
      listMissionByDevice?.current_state == STATUS_MISSION.ACCOMPLISHED ||
      listMissionByDevice?.current_state == STATUS_MISSION.CANCEL;
    const isCancel =
      listMissionByDevice &&
      listMissionByDevice?.current_state !== STATUS_MISSION.ACCOMPLISHED &&
      listMissionByDevice?.current_state !== STATUS_MISSION.CANCEL;
    return {
      isDone,
      isCancel,
    };
  }

  async findLocationWithSector({ dataByLocation, findCallBoxes }) {
    const { location, sectors, call_boxes_code } = findCallBoxes;
    const { product_name, sku } = dataByLocation;
    let filter = {},
      locationSuitable = null,
      missionsOnSchedule,
      areaUsing = [],
      locationUsing = [];
    const isPalletAvailable = sectors === "Chồng pallet rỗng";
    const isOutArea = sectors == "Pallet thành phẩm";
    filter["warehouse_type"] = isOutArea ? AREA.OUT_AREA : AREA.INPUT_AREA;
    if (isPalletAvailable) {
      filter["sectors"] = "Chồng pallet rỗng";
      missionsOnSchedule = await this.modelMissionHistory
        .find({
          sectors: "Chồng pallet rỗng",
          current_state: {
            $in: [
              STATUS_MISSION.REGISTERED,
              STATUS_MISSION.PENDING,
              STATUS_MISSION.PROCESSING,
            ],
          },
        })
        .lean();
      missionsOnSchedule.map((item) => {
        const name = item.pickup_location.split("#");
        areaUsing.push(name[0]);
        locationUsing.push(name[1]);
      });
      locationSuitable = await findDocumentWithOutboard(this.modelLocations, {
        ...filter,
        $or: [
          {
            areaCode: { $in: areaUsing },
            name: { $nin: locationUsing },
          },
          {
            areaCode: { $nin: areaUsing },
          },
        ],
        status: isOutArea ? STATUS_LOCATION.AVAILABLE : STATUS_LOCATION.FILL,
        ...(isPalletAvailable
          ? {}
          : {
              ...(isOutArea ? { line: location } : {}),
              product: product_name,
              sku,
            }),
      });
    } else if (isOutArea) {
      missionsOnSchedule = await this.modelMissionHistory
        .find({
          sectors: "Pallet thành phẩm",
          current_state: {
            $in: [
              STATUS_MISSION.REGISTERED,
              STATUS_MISSION.PENDING,
              STATUS_MISSION.PROCESSING,
            ],
          },
        })
        .lean();
      missionsOnSchedule.map((item) => {
        const name = item.return_location.split("#");
        areaUsing.push(name[0]);
        locationUsing.push(name[1]);
      });
      locationSuitable = await findDocumentWithInboard(this.modelLocations, {
        ...filter,
        $or: [
          {
            areaCode: { $in: areaUsing },
            name: { $nin: locationUsing },
          },
          {
            areaCode: { $nin: areaUsing },
          },
        ],
        status: STATUS_LOCATION.AVAILABLE,
        ...(isPalletAvailable
          ? {}
          : {
              line: location,
              product: product_name,
              sku,
            }),
      });
    } else {
      missionsOnSchedule = await this.modelMissionHistory
        .find({
          sectors: "Pallet carton",
          current_state: {
            $in: [
              STATUS_MISSION.REGISTERED,
              STATUS_MISSION.PENDING,
              STATUS_MISSION.PROCESSING,
            ],
          },
        })
        .lean();
      missionsOnSchedule.map((item) => {
        const name = item.pickup_location.split("#");
        areaUsing.push(name[0]);
        locationUsing.push(name[1]);
      });
      locationSuitable = await findDocumentWithOutboard(this.modelLocations, {
        ...filter,
        $or: [
          {
            areaCode: { $in: areaUsing },
            name: { $nin: locationUsing },
          },
          {
            areaCode: { $nin: areaUsing },
          },
        ],
        status: STATUS_LOCATION.FILL,
        ...(isPalletAvailable
          ? {}
          : {
              product: product_name,
              sku,
            }),
      });
    }
    const { name, areaCode, _id } = locationSuitable;
    if (isEmpty(locationSuitable)) {
      return await this.createMission({
        locationSuitable,
        pickup_location: isOutArea ? location : "",
        return_location: isOutArea ? "" : location,
        findCallBoxes,
        status: STATUS_MISSION.CANCEL,
        code: 5,
      });
    }
    if (!isOutArea) {
      return await this.createMission({
        locationSuitable,
        pickup_location: `${areaCode}#${name}`,
        return_location: location,
        findCallBoxes,
        status: STATUS_MISSION.REGISTERED,
        isOutArea: false,
        code: 1,
      });
    } else {
      return this.updateMissionWithWarehouseOutput({
        locationSuitable,
        findCallBoxes,
      });
    }
  }

  async updateWithDalActionCurtainWrap(data: any) {
    const { tasks } = data;
    const { action } = tasks[0];
    const findCallBoxes = await this.checkingCallBox(data);
    const { location, call_boxes_code, deviceId, sectors } = findCallBoxes;
    const listMissionByDevice = await findDocumentLatestWithDate(
      this.modelMissionHistory,
      { object_call: call_boxes_code },
    );
    if (action == 0) {
      if (this.checkStatusMissionByCallBox(listMissionByDevice).isCancel) {
        await this.modelMissionHistory.findOneAndUpdate(
          {
            object_call: call_boxes_code,
            mission_code: listMissionByDevice.mission_code,
          },
          {
            current_state: STATUS_MISSION.CANCEL,
            $push: {
              status_list: {
                status: STATUS_MISSION.CANCEL,
                updateAt: Date.now(),
              },
            },
          },
        );
        return {
          msg: "Cancel Ok",
          mission_rcs: listMissionByDevice?.mission_rcs || 0,
          mission_code: listMissionByDevice.mission_code,
          pickup_location: listMissionByDevice.pickup_location,
          return_location: listMissionByDevice.return_location,
          code: 3,
        };
      }
      throw new HttpException(
        {
          msg: "Dont cancel when not found mission process",
          code: 4,
        },
        HttpStatus.NOT_FOUND,
      );
    } else {
      let checkStatusMission;
      if (deviceId == "18" || deviceId == "16") {
        checkStatusMission = true;
      } else {
        checkStatusMission =
          this.checkStatusMissionByCallBox(listMissionByDevice).isDone;
      }
      if (checkStatusMission) {
        const findAreaCurtainWrap = await this.modalArea
          .findOne({ location_code: "quan_man" })
          .lean();
        const findLocationWithCurtainWrap = await this.modelLocations
          .findOne({ areaId: findAreaCurtainWrap._id })
          .lean();
        if (!findLocationWithCurtainWrap)
          throw new HttpException("location notfound", HttpStatus.NOT_FOUND);
        const newMission = await this.modelMissionHistory.create({
          mission_code: `MISSION-${uuidv4()}`,
          pickup_location: location,
          return_location: "Máy quấn màng",
          object_call: call_boxes_code,
          sector: "Pallet bán thành phẩm",
          call_boxes_id: findCallBoxes._id,
          current_state: STATUS_MISSION.REGISTERED,
          status_list: [
            {
              status: STATUS_MISSION.REGISTERED,
              updateAt: Date.now(),
            },
          ],
        });
        return {
          mission_rcs: newMission?.mission_rcs || 0,
          mission_code: newMission.mission_code || 0,
          pickup_location: newMission.pickup_location,
          sectors: "Pallet bán thành phẩm",
          return_location: newMission.return_location,
          location_id: findLocationWithCurtainWrap?._id,
          code: 1,
        };
      } else {
        throw new HttpException(
          {
            msg: "Exist mission with device",
            mission_rcs: listMissionByDevice?.mission_rcs || 0,
            mission_code: listMissionByDevice?.mission_code || 0,
            pickup_location: listMissionByDevice?.pickup_location,
            return_location: listMissionByDevice?.return_location,
            current_state: listMissionByDevice.current_state,
            code: 2,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }

  async updateWithDalAction(data: any) {
    const { tasks } = data;
    const { action } = tasks[0];
    const findCallBoxes = await this.checkingCallBox(data);
    const { location, call_boxes_code, sectors, deviceId } = findCallBoxes;
    const listMissionByDevice = await findDocumentLatestWithDate(
      this.modelMissionHistory,
      { object_call: call_boxes_code },
    );
    if (action == 0) {
      if (this.checkStatusMissionByCallBox(listMissionByDevice).isCancel)
        return {
          msg: "Cancel Ok",
          mission_rcs: listMissionByDevice?.mission_rcs || 0,
          mission_code: listMissionByDevice.mission_code,
          pickup_location: listMissionByDevice.pickup_location,
          return_location: listMissionByDevice.return_location,
          code: 3,
        };
      throw new HttpException(
        {
          msg: "Dont cancel when not found mission process",
          code: 4,
        },
        HttpStatus.NOT_FOUND,
      );
    } else {
      let checkStatusMission;
      if (deviceId === "18" || deviceId === "16") {
        checkStatusMission = true;
      } else {
        checkStatusMission =
          this.checkStatusMissionByCallBox(listMissionByDevice).isDone;
      }
      if (checkStatusMission) {
        const dataByLocation = systemData.find((item) => {
          return item.product_line == location;
        });
        if (!dataByLocation)
          throw new HttpException("Not found line", HttpStatus.NOT_FOUND);
        return await this.findLocationWithSector({
          dataByLocation,
          findCallBoxes,
        });
      } else {
        throw new HttpException(
          {
            msg: "Exist mission with device",
            mission_rcs: listMissionByDevice?.mission_rcs || 0,
            mission_code: listMissionByDevice?.mission_code || 0,
            pickup_location: listMissionByDevice?.pickup_location,
            return_location: listMissionByDevice?.return_location,
            current_state: listMissionByDevice.current_state,
            code: 2,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }

  async updateWithDalAction1(data: any) {
    const { tasks } = data;
    const { action } = tasks[0];
    const findCallBoxes = await this.checkingCallBox(data);
    const { location, sectors, call_boxes_code } = findCallBoxes;

    const listMissionByDevice = await findDocumentLatestWithDate(
      this.modelMissionHistory,
      // { object_call: object_call || call_boxes_code },
      { object_call: call_boxes_code },
    );

    if (action == 0) {
      if (
        listMissionByDevice &&
        listMissionByDevice.current_state != STATUS_MISSION.ACCOMPLISHED &&
        listMissionByDevice.current_state != STATUS_MISSION.CANCEL
      ) {
        return {
          msg: "Cancel Ok",
          mission_rcs: listMissionByDevice?.mission_rcs || 0,
          mission_code: listMissionByDevice.mission_code,
          pickup_location: listMissionByDevice.pickup_location,
          return_location: listMissionByDevice.return_location,
          code: 3,
        };
      }
      throw new HttpException(
        {
          msg: "Dont cancel when not found mission process",
          code: 4,
        },
        HttpStatus.NOT_FOUND,
      );
    }
    if (action == 1) {
      if (
        listMissionByDevice?.current_state == STATUS_MISSION.ACCOMPLISHED ||
        listMissionByDevice?.current_state == STATUS_MISSION.CANCEL ||
        !listMissionByDevice
      ) {
        // else
        const dataByLocation = systemData.find((item) => {
          return item.product_line == location;
        });

        if (!dataByLocation)
          throw new HttpException("Not found line", HttpStatus.NOT_FOUND);
        const { product_name, sku } = dataByLocation;
        const findLocationAndCreateMissionHistory = async (
          filter,
          typeSector,
        ) => {
          const isOutArea = filter.warehouse_type == AREA.OUT_AREA;
          let locationSuitable = null;
          if (sectors === "Chồng pallet rỗng") {
            filter["sectors"] = "Chồng pallet rỗng";
            locationSuitable = await findDocumentOldestWithDate(
              this.modelLocations,
              {
                ...filter,
                status: isOutArea
                  ? STATUS_LOCATION.AVAILABLE
                  : STATUS_LOCATION.FILL,
              },
            );
          } else {
            locationSuitable = await findDocumentOldestWithDate(
              this.modelLocations,
              {
                ...filter,
                ...(isOutArea ? { line: location } : {}),
                status: isOutArea
                  ? STATUS_LOCATION.AVAILABLE
                  : STATUS_LOCATION.FILL,
                product_name,
                sku,
              },
            );
          }
          if (!locationSuitable) {
            const newMission = await this.modelMissionHistory.create({
              mission_code: `MISSION-${uuidv4()}`,
              pickup_location: isOutArea ? location : "",
              return_location: isOutArea ? "" : location,
              // object_call: object_call || call_boxes_code,
              object_call: call_boxes_code,
              sector: sectors,
              description: "Không tìm thấy vị trí trong kho phù hợp",
              call_boxes_id: findCallBoxes._id,
              current_state: STATUS_MISSION.CANCEL,
              status_list: [
                {
                  status: STATUS_MISSION.REGISTERED,
                  updateAt: Date.now(),
                },
              ],
            });
            return {
              mission_rcs: newMission?.mission_rcs || 0,
              mission_code: newMission.mission_code || 0,
              pickup_location: newMission.pickup_location,
              sectors,
              return_location: newMission.return_location,
              code: 5,
            };
          }
          const { name, areaCode, _id } = locationSuitable;
          // if (isOutArea) {
          //   console.log('dvk', isOutArea);

          //   return this.updateMissionWithWarehouseOutput(locationSuitable, {
          //     call_boxes_code,
          //     sectors,
          //     findCallBoxes,
          //   });
          // }
          const newMission = await this.modelMissionHistory.create({
            mission_code: `MISSION-${uuidv4()}`,
            pickup_location: isOutArea ? location : `${areaCode}#${name}`,
            return_location: isOutArea ? `${areaCode}#${name}` : location,
            // object_call: object_call || call_boxes_code,
            object_call: call_boxes_code,
            sector: sectors,
            call_boxes_id: findCallBoxes._id,
            current_state: STATUS_MISSION.REGISTERED,
            status_list: [
              {
                status: STATUS_MISSION.REGISTERED,
                updateAt: Date.now(),
              },
            ],
          });
          return {
            mission_rcs: newMission?.mission_rcs || 0,
            mission_code: newMission.mission_code || 0,
            pickup_location: newMission.pickup_location,
            sectors,
            return_location: newMission.return_location,
            location_id: _id,
            code: 1,
          };
        };
        return findLocationAndCreateMissionHistory(
          {
            warehouse_type:
              sectors == "Pallet thành phẩm" ? AREA.OUT_AREA : AREA.INPUT_AREA,
          },
          sectors,
        );
      }

      throw new HttpException(
        {
          msg: "Exist mission with device",
          mission_rcs: listMissionByDevice?.mission_rcs || 0,
          mission_code: listMissionByDevice.mission_code || 0,
          pickup_location: listMissionByDevice.pickup_location,
          return_location: listMissionByDevice.return_location,
          current_state: listMissionByDevice.current_state,
          code: 2,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async delete(id: string) {
    const deleteSuccess = await this.modelCallBoxes.findByIdAndDelete(id);
    if (!deleteSuccess)
      throw new HttpException("Id invalid", HttpStatus.NOT_FOUND);
    return {
      msg: "Delete Menu Success",
    };
  }
}
