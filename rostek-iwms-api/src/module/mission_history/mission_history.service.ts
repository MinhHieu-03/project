import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { MissionHistoryDto } from "src/dtos/MissionHistory.dto";
import {
  MissionHistory,
  STATUS_MISSION,
} from "src/shemas/mission_history.schema";
import { FilterDataResponse, convertDataResponse } from "src/ultil";
import { FilterQuery } from "src/ultil/type";
import { Workbook } from "exceljs";
import * as tmp from "tmp";
import { Response } from "express";
import { getUnselectData } from "src/ultil/convert_data";

@Injectable()
export class MissionHistoryService {
  constructor(
    @InjectModel(MissionHistory.name)
    private modelMissionHistory: Model<MissionHistory>,
  ) {}

  async getAll() {
    const data = await this.modelMissionHistory.find();
    return convertDataResponse("OK", data);
  }

  async getAllDal(current_state) {
    const data = await this.modelMissionHistory
      .find({
        current_state: {
          $ne: current_state,
        },
      })
      .select(getUnselectData(["status"]));
    return convertDataResponse("OK", data);
  }

  async getUserByFilter(body: FilterQuery) {
    const datas = await FilterDataResponse(body, this.modelMissionHistory);
    // console.log("datas ", datas)
    if (datas?.metaData) {
      datas.metaData.map((item) => {
        if (item.sector === "Pallet bán thành phẩm") {
          item["sector"] = "Pallet thành phẩm";
        }
        return item;
      });
    }
    return datas;
  }

  async downloadExcel(query, res: Response) {
    const data = await this.modelMissionHistory
      .find(query)
      .select(["-_id", "-__v"])
      .lean();
    const rows = [];
    data.forEach((doc) => {
      rows.push(Object.values(doc));
    });
    const book = new Workbook();
    const sheet = book.addWorksheet("MissionHistory");
    rows.unshift(Object.keys(data[0]));
    sheet.addRows(rows);
    book.xlsx
      .write(res)
      .then(() => res.end())
      .catch((error) => {
        throw new HttpException("Download Fail", HttpStatus.BAD_REQUEST);
      });
  }
  async getById(id: any) {
    const data = await this.modelMissionHistory.findById(id);
    if (!data) throw new HttpException("Id invalid", HttpStatus.NOT_FOUND);
    return convertDataResponse("Ok", data);
  }
  async create({ current_state, ...data }: MissionHistoryDto) {
    const newData = await this.modelMissionHistory.create({
      ...data,
      current_state,
      status_list: [
        {
          status: current_state,
          updateAt: Date.now(),
        },
      ],
    });
    return convertDataResponse("Create Success", newData);
  }
  async update({ filter, current_state, ...data }: any) {
    const dataUpdate = await this.modelMissionHistory.findOneAndUpdate(
      filter,
      {
        ...data,
        ...(current_state
          ? {
              current_state,
              $push: {
                status_list: {
                  status: current_state,
                  updateAt: Date.now(),
                },
              },
            }
          : {}),
      },
      {
        new: true,
      },
    );
    return {
      msg: "Update Success",
      code: 0,
      data: dataUpdate,
    };
  }

  async delete(id: string) {
    const deleteSuccess = await this.modelMissionHistory.findByIdAndDelete(id);
    if (!deleteSuccess)
      throw new HttpException("Id invalid", HttpStatus.NOT_FOUND);
    return {
      msg: "Delete Menu Success",
    };
  }
}
