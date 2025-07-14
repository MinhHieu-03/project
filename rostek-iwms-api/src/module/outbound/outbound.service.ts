import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { OutboundDto } from "src/dtos/Outbound.dto";
import { Outbound } from "src/shemas/outbound.schema";
import { Inventory } from "src/shemas/inventory.schema";
import { Location } from "src/shemas/location.schema";
import { FilterDataResponse, convertDataResponse } from "src/ultil";
import { FilterQuery } from "src/ultil/type";

@Injectable()
export class OutboundService {
  constructor(
    @InjectModel(Outbound.name) private outboundModel: Model<Outbound>,
    @InjectModel(Inventory.name) private inventoryModel: Model<Inventory>,
    @InjectModel(Location.name) private locationModel: Model<Location>,
  ) {}

  async create(data: OutboundDto, userName: string) {
    try {
      // Verify inventory exists
      const inventory = await this.inventoryModel
        .findOne({
          sku: data.sku,
          "store.key": data.unit,
          "store.qty": { $gte: data.qty },
          status: "fill",
        })
        .sort({ createdAt: 1 });
      // .lean();
      console.log(inventory);
      if (!inventory) {
        throw new HttpException("Inventory not found", HttpStatus.NOT_FOUND);
      }
      const outbound = await this.outboundModel.create({
        // order_id: data.order_id,
        // bin_code: data.bin_code,
        sku: data.sku,
        qty: data.qty,
        unit: data.unit,
        location: inventory.locationCode,
        status: "new",
        // mission: data.mission,
        inventory: inventory._id,
        pic: userName,
      });
      await inventory.updateOne({
        status: "wait_outbound",
      });
      await this.locationModel.updateOne(
        {
          code: inventory.locationCode,
        },
        {
          status: "wait_outbound",
        },
      );
      return convertDataResponse("Create Success", outbound);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async getAll(params: any) {
    const data = await this.outboundModel.find(params).populate("inventory");
    return convertDataResponse("OK", data);
  }

  async getByFilter(body: FilterQuery) {
    try {
      const filter = { ...body, populate: ["inventory"] };
      return await FilterDataResponse(filter, this.outboundModel, "OK",  ["inventory"]);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getById(id: any) {
    const data = await this.outboundModel.findById(id).populate("inventory");
    if (!data) throw new HttpException("Id invalid", HttpStatus.NOT_FOUND);
    return convertDataResponse("Ok", data);
  }

  async update(data: any, id: string) {
    const dataUpdate = await this.outboundModel.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (!dataUpdate) {
      throw new HttpException("Id invalid", HttpStatus.NOT_FOUND);
    }
    return convertDataResponse("Update Success", dataUpdate);
  }

  async delete(id: string) {
    const deleteSuccess = await this.outboundModel.findByIdAndDelete(id);
    if (!deleteSuccess) {
      throw new HttpException("Id invalid", HttpStatus.NOT_FOUND);
    }
    return {
      msg: "Delete Success",
    };
  }
}
