import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AreaDto } from "src/dtos/Area.dto";
import { Area } from "src/shemas/area.schema";
import { Location } from "src/shemas/location.schema";
import { Warehouse } from "src/shemas/warehouse.schema";
import { AreaConfig } from "src/shemas/areaconfig.schema";
import { FilterDataResponse, convertDataResponse } from "src/ultil";
import { FilterQuery } from "src/ultil/type";

@Injectable()
export class AreaService {
  constructor(
    @InjectModel(Location.name) private locationModel: Model<Location>,
    @InjectModel(Warehouse.name) private warehouseModel: Model<Warehouse>,
    @InjectModel(Area.name) private modelArea: Model<Area>,
    @InjectModel(AreaConfig.name) private areaConfigModel: Model<AreaConfig>,
  ) { }

  async getAll(params: any) {
    const data = await this.modelArea
      .find(params)
      .populate("warehouse", "name")
      .populate("area_config", "name productions");
    return convertDataResponse("OK", data);
  }

  async getUserByFilter(body: FilterQuery) {
    try {
      const filter = { ...body };
      if (filter?.filter?.['location_code'])
        filter.filter['location_code'] = new RegExp(`${filter.filter['location_code']}`, "i");
      return await FilterDataResponse(filter, this.modelArea, 'OK', [
        { path: 'warehouse', select: 'name' },
        { path: 'area_config', select: 'name' }
      ]);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getById(id: any) {
    const data = await this.modelArea
      .findById(id)
      .populate("warehouse", "name")
      .populate("area_config", "name productions");
    if (!data) throw new HttpException("Id invalid", HttpStatus.NOT_FOUND);
    return convertDataResponse("Ok", data);
  }

  async create(data: AreaDto) {
    try {
      if (data.warehouse) {
        const warehouse = await this.warehouseModel.findOne({
          _id: data.warehouse,
        });
        if (!warehouse) {
          throw new HttpException("Warehouse not found", HttpStatus.NOT_FOUND);
        }
      }
      if (data.area_config) {
        const areaConfig = await this.areaConfigModel.findOne({
          _id: data.area_config,
        });
        if (!areaConfig) {
          throw new HttpException(
            "Area Configuration not found",
            HttpStatus.NOT_FOUND,
          );
        }
      }

      // Create new area linked to warehouse and area_config
      const newData = await this.modelArea.create({
        ...data,
        warehouse: data.warehouse,
        area_config: data.area_config,
      });

      return convertDataResponse("Create Success", newData);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async update(data: any, id: string) {
    // Check if area_config exists if it's being updated
    if (data.area_config) {
      const areaConfig = await this.areaConfigModel.findOne({
        _id: data.area_config,
      });
      if (!areaConfig) {
        throw new HttpException(
          "Area Configuration not found",
          HttpStatus.NOT_FOUND,
        );
      }
    }

    const dataUpdate = await this.modelArea
      .findByIdAndUpdate(id, data, {
        new: true,
      })
      .populate("warehouse", "name")
      .populate("area_config", "name productions");

    const { location_code, row, column, area_config, _id } = dataUpdate;
    this.upsertLocation({ location_code, row, column, area_config: area_config, _id })
      .then((data) => {
        console.log("dnd_Success", data);
      })
      .catch((error) => {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      });

    return convertDataResponse("Update Success", dataUpdate);
  }

  async upsertLocation({ location_code, row, column, area_config, _id }) {
    for (let i = 1; i <= row; i++) {
      for (let j = 1; j <= column; j++) {
        const locationCode = `${location_code}$${convertNumber(i)}$${convertNumber(j)}`;
        await
          this.locationModel.findOneAndUpdate(
            { name: locationCode },
            { areaCode: location_code, area_config, areaId: _id },
            { upsert: true }
          );
      }
    }
  };


  async delete(ids: string | string[]) {
    try {
      // Handle single ID
      if (typeof ids === 'string') {
        const deleteSuccess = await this.modelArea.findByIdAndDelete(ids);
        if (!deleteSuccess) {
          throw new HttpException("Id invalid", HttpStatus.NOT_FOUND);
        }
        // Delete related locations
        await this.locationModel.deleteMany({ areaId: deleteSuccess._id });
        return {
          msg: "Delete Area Success",
        };
      }

      // Handle multiple IDs
      const areasToDelete = await this.modelArea.find({ _id: { $in: ids } });
      if (areasToDelete.length === 0) {
        throw new HttpException("No valid IDs found", HttpStatus.NOT_FOUND);
      }

      // Extract area IDs to delete related locations
      const areaIds = areasToDelete.map(area => area._id);

      // Delete areas and related locations
      await this.modelArea.deleteMany({ _id: { $in: ids } });
      await this.locationModel.deleteMany({ areaId: { $in: areaIds } });

      return {
        msg: `Successfully deleted ${areasToDelete.length} areas and their locations`,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}


const convertNumber = (num: number) => num < 10 ? `0${num}` : num;
