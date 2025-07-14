import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { InventoryDto } from "src/dtos/Inventory.dto";
import { Inventory, INVENTORY_STATUS } from "src/shemas/inventory.schema";
import { Location, STATUS_LOCATION } from "src/shemas/location.schema";
import { Area } from "src/shemas/area.schema";
import { AreaConfig } from "src/shemas/areaconfig.schema";
import { FilterDataResponse, convertDataResponse } from "src/ultil";
import { FilterQuery } from "src/ultil/type";

@Injectable()
export class InventoryService {
    constructor(
        @InjectModel(Inventory.name) private inventoryModel: Model<Inventory>,
        @InjectModel(Location.name) private modelLocation: Model<Location>,
        @InjectModel(Area.name) private modelArea: Model<Area>,
        @InjectModel(AreaConfig.name) private modelAreaConfig: Model<AreaConfig>,
    ) { }

    async getAll(params: any) {
        const data = await this.inventoryModel.find(params);
        return convertDataResponse("OK", data);
    }

    async getByFilter(body: FilterQuery) {
        try {
            const filter = { ...body };
            return await FilterDataResponse(filter, this.inventoryModel, 'OK');
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    async getById(id: any) {
        const data = await this.inventoryModel.findById(id);
        if (!data) throw new HttpException("Id invalid", HttpStatus.NOT_FOUND);
        return convertDataResponse("Ok", data);
    }

    async create(data: InventoryDto) {
        try {
            // If status is not provided, set it to default ACTIVE
            if (!data.status) {
                data.status = INVENTORY_STATUS.ACTIVE;
            }

            const newInventory = new this.inventoryModel(data);
            await newInventory.save();
            return convertDataResponse("Create Success", newInventory);
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    async update(data: any, id: string) {
        const dataUpdate = await this.inventoryModel
            .findByIdAndUpdate(id, data, {
                new: true,
            });
        if (!dataUpdate) {
            throw new HttpException("Id invalid", HttpStatus.NOT_FOUND);
        }
        return convertDataResponse("Update Success", dataUpdate);
    }

    async delete(id: string) {
        const deleteSuccess = await this.inventoryModel.findByIdAndDelete(id);
        if (!deleteSuccess) {
            throw new HttpException("Id invalid", HttpStatus.NOT_FOUND);
        }
        return {
            msg: "Delete Success",
        };
    }

    // Add a new method to update status
    async updateStatus(id: string, status: INVENTORY_STATUS) {
        const inventory = await this.inventoryModel.findById(id);
        if (!inventory) {
            throw new HttpException("Inventory not found", HttpStatus.NOT_FOUND);
        }

        inventory.status = status;
        await inventory.save();

        return convertDataResponse("Status updated successfully", inventory);
    }
}
