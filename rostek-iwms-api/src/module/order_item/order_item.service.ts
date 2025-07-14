import {
    HttpException,
    HttpStatus,
    Injectable,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { OrderItemDto } from "src/dtos/OrderItem.dto";
import { OrderItem } from "src/shemas/order_item.schema";
import { FilterDataResponse, convertDataResponse } from "src/ultil";
import { FilterQuery } from "src/ultil/type";

@Injectable()
export class OrderItemService {
    constructor(
        @InjectModel(OrderItem.name) private orderItem: Model<OrderItem>,
    ) { }

    async getAll(params: any) {
        const data = await this.orderItem.find(params);
        return convertDataResponse("OK", data);
    }

    async getByFilter(body: FilterQuery) {
        try {
            const filter = { ...body };
            return await FilterDataResponse(filter, this.orderItem, "OK");
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    async getById(id: any) {
        const data = await this.orderItem.findById(id);
        if (!data) throw new HttpException("Id invalid", HttpStatus.NOT_FOUND);
        return convertDataResponse("Ok", data);
    }

    async getByOrderId(orderId: string) {
        const data = await this.orderItem.find({ orderId }).lean();
        return convertDataResponse("Ok", data);
    }

    async create(data: OrderItemDto) {
        try {
            const newData = await this.orderItem.create(data);
            return convertDataResponse("Create Success", newData);
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    async update(data: any, id: string) {
        const dataUpdate = await this.orderItem.findByIdAndUpdate(id, data, {
            new: true,
        });
        if (!dataUpdate) {
            throw new HttpException("Id invalid", HttpStatus.NOT_FOUND);
        }
        return convertDataResponse("Update Success", dataUpdate);
    }

    async delete(id: string) {
        const deleteSuccess = await this.orderItem.findByIdAndDelete(id);
        if (!deleteSuccess) {
            throw new HttpException("Id invalid", HttpStatus.NOT_FOUND);
        }
        return {
            msg: "Delete Success",
        };
    }
}
