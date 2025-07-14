import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AreaConfig } from "src/shemas/areaconfig.schema";
import { Warehouse } from "src/shemas/warehouse.schema";
import { FilterDataResponse, convertDataResponse } from "src/ultil";
import { FilterQuery } from "src/ultil/type";
import { AreaConfigDto } from "src/dtos/AreaConfig.dto";

@Injectable()
export class AreaConfigService {
  constructor(
    @InjectModel(AreaConfig.name) private modelAreaConfig: Model<AreaConfig>,
    @InjectModel(Warehouse.name) private modelWarehouse: Model<Warehouse>,
  ) { }

  async getAll() {
    const data = await this.modelAreaConfig.find().populate('warehouse');
    return convertDataResponse("OK", data);
  }

  async getByFilter(body: FilterQuery) {
    return await FilterDataResponse(body, this.modelAreaConfig, "OK", [
      { path: 'warehouse', select: 'name description' }
    ]);
  }

  async getById(id: any) {
    const data = await this.modelAreaConfig.findById(id).populate('warehouse');
    if (!data) throw new HttpException("Id invalid", HttpStatus.NOT_FOUND);
    return convertDataResponse("Ok", data);
  }

  async create(data: AreaConfigDto) {
    try {
      // Validate warehouse reference if provided
      if (data.warehouse) {
        const warehouse = await this.modelWarehouse.findById(data.warehouse);
        if (!warehouse) {
          throw new HttpException("Warehouse not found", HttpStatus.NOT_FOUND);
        }
      }

      const newData = await this.modelAreaConfig.create(data);
      return convertDataResponse("Create Success", newData);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async update(data: any, id: string) {
    const dataUpdate = await this.modelAreaConfig.findByIdAndUpdate(id, data, {
      new: true,
    });
    return convertDataResponse("Update Success", dataUpdate);
  }

  async delete(id: string) {
    const deleteSuccess = await this.modelAreaConfig.findByIdAndDelete(id);
    if (!deleteSuccess)
      throw new HttpException("Id invalid", HttpStatus.NOT_FOUND);
    return {
      msg: "Delete Success",
      data: deleteSuccess,
    };
  }

  async deleteMany(ids: string[]) {
    try {
      const result = await this.modelAreaConfig.deleteMany({ _id: { $in: ids } });
      if (result.deletedCount === 0) {
        throw new HttpException("No records found to delete", HttpStatus.NOT_FOUND);
      }
      return {
        msg: "Delete Success",
        data: { deletedCount: result.deletedCount }
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
