import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { StorageModelDto } from "src/dtos/StorageModel.dto";
import { StorageModel } from "src/shemas/storage_model.schema";
import { FilterDataResponse, convertDataResponse } from "src/ultil";
import { FilterQuery } from "src/ultil/type";

@Injectable()
export class StorageModelService {
    constructor(
        @InjectModel(StorageModel.name) private storageModel: Model<StorageModel>,
    ) { }

    async getAll(params: any) {
        const data = await this.storageModel.find(params);
        return convertDataResponse("OK", data);
    }

    async getByFilter(body: FilterQuery) {
        try {
            const filter = { ...body };
            return await FilterDataResponse(filter, this.storageModel, 'OK');
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    async getById(id: any) {
        const data = await this.storageModel.findById(id);
        if (!data) throw new HttpException("Id invalid", HttpStatus.NOT_FOUND);
        return convertDataResponse("Ok", data);
    }

    async create(data: StorageModelDto) {
        try {
            const newData = await this.storageModel.updateOne(
                {}, // Query condition
                { $set: data }, // Update operation
                { upsert: true } // Enable upsert
            );
            return convertDataResponse("Create Success", newData);
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    async update(data: any, id: string) {
        const dataUpdate = await this.storageModel
            .findByIdAndUpdate(id, data, {
                new: true,
            });
        if (!dataUpdate) {
            throw new HttpException("Id invalid", HttpStatus.NOT_FOUND);
        }
        return convertDataResponse("Update Success", dataUpdate);
    }

    async delete(id: string) {
        const deleteSuccess = await this.storageModel.findByIdAndDelete(id);
        if (!deleteSuccess) {
            throw new HttpException("Id invalid", HttpStatus.NOT_FOUND);
        }
        return {
            msg: "Delete Success",
        };
    }
} 