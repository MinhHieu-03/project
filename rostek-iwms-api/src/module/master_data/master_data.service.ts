import {
  HttpException,
  HttpStatus,
  Injectable,
  BadRequestException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { chunk } from "lodash";
import { MasterDataDto } from "src/dtos/MasterData.dto";
import { MasterData } from "src/shemas/master_data.schema";
import { FilterDataResponse, convertDataResponse } from "src/ultil";
import { FilterQuery } from "src/ultil/type";

@Injectable()
export class MasterDataService {
  constructor(
    @InjectModel(MasterData.name) private masterData: Model<MasterData>,
    @InjectModel("MasterData") private masterDataModel: Model<any>,
  ) {}

  async getAll(params: any) {
    const data = await this.masterData.find(params);
    return convertDataResponse("OK", data);
  }

  async getByFilter(body: FilterQuery) {
    try {
      const filter = { ...body };
      return await FilterDataResponse(filter, this.masterData, "OK");
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getById(id: any) {
    const data = await this.masterData.findById(id);
    if (!data) throw new HttpException("Id invalid", HttpStatus.NOT_FOUND);
    return convertDataResponse("Ok", data);
  }
  async getByMaterialNo(material_no: string) {
    const data = await this.masterData
      .findOne({ material_no: material_no })
      .lean();
    if (!data)
      throw new HttpException("Material not found", HttpStatus.NOT_FOUND);
    return convertDataResponse("Ok", data);
  }

  async create(data: MasterDataDto) {
    try {
      const newData = await this.masterData.create(data);
      return convertDataResponse("Create Success", newData);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async update(data: any, id: string) {
    const dataUpdate = await this.masterData.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (!dataUpdate) {
      throw new HttpException("Id invalid", HttpStatus.NOT_FOUND);
    }
    return convertDataResponse("Update Success", dataUpdate);
  }

  async delete(id: string) {
    const deleteSuccess = await this.masterData.findByIdAndDelete(id);
    if (!deleteSuccess) {
      throw new HttpException("Id invalid", HttpStatus.NOT_FOUND);
    }
    return {
      msg: "Delete Success",
    };
  }

  async deleteMultiple(ids: string[]) {
    if (!ids || ids.length === 0) {
      throw new HttpException("No IDs provided", HttpStatus.BAD_REQUEST);
    }

    try {
      const deleteResult = await this.masterData.deleteMany({
        _id: { $in: ids },
      });

      if (deleteResult.deletedCount === 0) {
        throw new HttpException(
          "No records found to delete",
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        msg: "Delete Success",
        deletedCount: deleteResult.deletedCount,
        totalRequested: ids.length,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async processExcelFile(data: any) {
    if (!data) {
      throw new BadRequestException("No file uploaded");
    }

    try {
      // Import data into MongoDB
      const chunkSize = 10;
      const chunkData = chunk(data, chunkSize);
      const listErrors = [];
      for (let i = 0; i < chunkData.length; i++) {
        await Promise.all(
          chunkData[i].map((item: any) => {
            return this.masterDataModel
              .updateOne(
                {
                  material_no: item.material_no,
                },
                {
                  $set: {
                    material_no: trimText(item.material_no),
                    material_nm: trimText(item.material_nm),
                    material_tp: trimText(item.material_tp),
                    pk_style: Number(item.pk_style) || 0,
                    new_pk_style: Number(item.new_pk_style) || 0,
                    pcs_bag: Number(item.pcs_bag) || 0,
                    flg: Number(item.flg) || 0,
                    comment: trimText(item.comment) || "",
                    user_id: trimText(item.user_id),
                    ent_dt: item.ent_dt ? new Date(item.ent_dt) : new Date(),
                    upd_dt: new Date(),
                  },
                },
                { upsert: true },
              )
              .catch((err) => {
                listErrors.push({
                  material_no: item.material_no,
                  error: err.message,
                });
              });
          }),
        );
      }
      return {
        message: "Data imported successfully",
        countFails: listErrors.length,
        countSuccess: data.length - listErrors.length,
        listErrors,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Failed to process file: ${error.message}`);
    }
  }
}

const trimText = (text: string) => {
  try {
    return text.trim();
  } catch {
    return text;
  }
};
