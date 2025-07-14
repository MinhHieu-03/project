import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { InboundDto, UpdateInboundDto } from "src/dtos/Inbound.dto";
import { Inbound } from "src/shemas/inbound.schema";
import { Area } from "src/shemas/area.schema";
import { Location, STATUS_LOCATION } from "src/shemas/location.schema";
import { AreaConfig } from "src/shemas/areaconfig.schema";
import { FilterDataResponse, convertDataResponse } from "src/ultil";
import { FilterQuery } from "src/ultil/type";
import { Inventory } from "src/shemas/inventory.schema";

@Injectable()
export class InboundService {
  constructor(
    @InjectModel(Inbound.name) private inboundModel: Model<Inbound>,
    @InjectModel(Location.name) private modelLocation: Model<Location>,
    @InjectModel(Area.name) private modelArea: Model<Area>,
    @InjectModel(AreaConfig.name) private modelAreaConfig: Model<AreaConfig>,
    @InjectModel(Inventory.name) private modelInventory: Model<Inventory>,
  ) {}

  async getAll(params: any) {
    const data = await this.inboundModel.find(params);
    return convertDataResponse("OK", data);
  }

  async getByFilter(body: FilterQuery) {
    try {
      const filter = { ...body };
      const populate = body.populate || [];
      return await FilterDataResponse(
        filter,
        this.inboundModel,
        "OK",
        populate,
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getById(id: any, query: { [key: string]: any }) {
    const data = await this.inboundModel.findById(id).populate("inventory");
    if (!data) throw new HttpException("Id invalid", HttpStatus.NOT_FOUND);
    return convertDataResponse("Ok", data);
  }

  async create(data: InboundDto, userName: string) {
    try {
      const lo = await this.findLocationBySKU(data.sku);
      const inventory = await this.modelInventory.create({
        sku: data.sku,
        product_name: data.product_name,
        locationId: lo._id,
        locationCode: lo.code,
        store: data.store,
        status: STATUS_LOCATION.WAIT_FILL,
        available: data.store[data.store.length - 1].qty,
      });
      lo.inventory = inventory._id;
      lo.status = STATUS_LOCATION.WAIT_FILL;
      await lo.save();
      const inbound = await this.inboundModel.create({
        sku: data.sku,
        inventory: inventory._id,
        location: lo._id,
        product_name: data.product_name,
        destination: lo.code,
        origin: "inbound",
        pic: userName,
        status: STATUS_LOCATION.WAIT_FILL,
      });
      return convertDataResponse("Create Success", {
        inbound,
        inventory,
        lo,
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findLocationBySKU(sku: string) {
    try {
      const lo = await this.modelLocation.findOne({
        skus: { $in: sku },
        status: STATUS_LOCATION.AVAILABLE,
      });
      if (!lo) {
        throw new HttpException("Location not found", HttpStatus.NOT_FOUND);
      }
      return lo;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async update(data: any, id: string) {
    if (data.status) {
      if (!Object.values(STATUS_LOCATION).includes(data.status)) {
        throw new HttpException("Status is not valid", HttpStatus.BAD_REQUEST);
      }
      const inboundData = await this.inboundModel.findById(id);
      await this.modelInventory.findByIdAndUpdate(inboundData.inventory, {
        status: data.status,
      });
      await this.modelLocation.findByIdAndUpdate(inboundData.location, {
        status: data.status,
      });
      inboundData.status = data.status;
      const dataUpdate = await inboundData.save();
      return convertDataResponse("Update Success", dataUpdate);
    } else {
      const dataUpdate = await this.inboundModel.findByIdAndUpdate(id, data, {
        new: true,
      });

      if (!dataUpdate) {
        throw new HttpException("Id invalid", HttpStatus.NOT_FOUND);
      }
      return convertDataResponse("Update Success", dataUpdate);
    }
  }

  async delete(id: string) {
    const deleteSuccess = await this.inboundModel.findByIdAndDelete(id);
    if (!deleteSuccess) {
      throw new HttpException("Id invalid", HttpStatus.NOT_FOUND);
    }
    return {
      msg: "Delete Success",
    };
  }
}
