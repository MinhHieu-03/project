import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AreaDto } from "src/dtos/Area.dto";
import { Warehouse } from "src/shemas/warehouse.schema";
import { Location } from "src/shemas/location.schema";
import { FilterDataResponse, convertDataResponse } from "src/ultil";
import { FilterQuery } from "src/ultil/type";
import { WarehouseDto } from "src/dtos/Warehouse.dto";
@Injectable()
export class WarehouseService {
  constructor(
    // @InjectModel(Location.name) private modelWarehouse: Model<Location>,
    @InjectModel(Warehouse.name) private modelWarehouse: Model<Warehouse>,
  ) { }

  async getAll() {
    const data = await this.modelWarehouse.find();
    return convertDataResponse("OK", data);
  }

  async paginationAndFilter(body: FilterQuery) {
    return await FilterDataResponse(body, this.modelWarehouse);
  }
  async getById(id: any) {
    const data = await this.modelWarehouse.findById(id);
    if (!data) throw new HttpException("Id invalid", HttpStatus.NOT_FOUND);
    return convertDataResponse("Ok", data);
  }
  async create(data: WarehouseDto) {
    try {
      const newData = await this.modelWarehouse.create(data);
      return convertDataResponse("Create Success", newData);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async update(data: any, id: string) {
    try {
      const dataUpdate = await this.modelWarehouse.findByIdAndUpdate(id, data, {
        new: true,
      });
      return convertDataResponse("Update Success", dataUpdate);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async delete(ids: string | string[]) {
    try {
      // Handle single ID
      if (typeof ids === 'string') {
        const deleteSuccess = await this.modelWarehouse.findByIdAndDelete(ids);
        if (!deleteSuccess) {
          throw new HttpException("Id invalid", HttpStatus.NOT_FOUND);
        }
        return {
          msg: "Delete Success",
        };
      }

      // Handle multiple IDs
      const deleteResult = await this.modelWarehouse.deleteMany({ _id: { $in: ids } });
      if (deleteResult.deletedCount === 0) {
        throw new HttpException("No valid IDs found", HttpStatus.NOT_FOUND);
      }

      return {
        msg: `Successfully deleted ${deleteResult.deletedCount} warehouses`,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
