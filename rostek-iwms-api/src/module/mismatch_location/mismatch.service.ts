import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { FilterDataResponse, convertDataResponse } from "src/ultil";
import { FilterQuery } from "src/ultil/type";
import { STATUS_LOCATION } from "../../shemas/location.schema";
import { Location } from "src/shemas/location.schema";
import {
  MismatchLocation,
  RCS_STATUS_LOCATION,
} from "src/shemas/mismatch_location.schema";
import { Worker, isMainThread } from "worker_threads";
import { MismatchLocationDto } from "src/dtos/MismatchLocation.dto";

const url_dal = "http://127.0.0.1:8080/send_bind";

@Injectable()
export class MismatchLocationService {
  private on_working = false;
  constructor(
    @InjectModel(Location.name) private modelLocation: Model<Location>,
    @InjectModel(MismatchLocation.name)
    private modelMismatchLocation: Model<MismatchLocation>,
  ) {}

  checkMainThread() {
    return isMainThread;
  }

  async getAll() {
    const data = await this.modelMismatchLocation.find();
    return convertDataResponse(this.on_working.toString(), data);
  }

  async getByFilter(body: FilterQuery) {
    return await FilterDataResponse(
      body,
      this.modelMismatchLocation,
      this.on_working.toString(),
    );
  }

  async checkMismatch() {
    if (this.on_working) return { msg: "Hệ thống đang kiểm tra" };
    await this.modelMismatchLocation.deleteMany();
    try {
      await fetch("http://127.0.0.1:3005/check_RCS", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      this.on_working = true;
      return { msg: "Bắt đầu kiểm tra đồng bộ RCS" };
    } catch (error) {
      console.error("Cannot call WCS to check RCS:", error);
      return { msg: "Cannot call WCS to check RCS" };
    }
  }

  async updateMismatch(data: MismatchLocationDto) {
    await this.modelMismatchLocation.insertMany([data]);
    return { msg: "OK" };
  }

  async stopCheck() {
    this.on_working = false;
    return { msg: "OK" };
  }
}
