import {
    HttpException,
    HttpStatus,
    Injectable,
    BadRequestException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { OrderDto } from "src/dtos/Order.dto";
import { Order } from "src/shemas/order.schema";
import { FilterDataResponse, convertDataResponse } from "src/ultil";
import { FilterQuery } from "src/ultil/type";

@Injectable()
export class OrderService {
    constructor(
        @InjectModel(Order.name) private orderModel: Model<Order>
    ) { }

    async getAll(params: any) {
        const data = await this.orderModel.find(params);
        return convertDataResponse("OK", data);
    }

    async getByFilter(body: FilterQuery) {
        try {
            const filter = { ...body };
            return await FilterDataResponse(filter, this.orderModel, "OK");
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    async getById(id: string) {
        const data = await this.orderModel.findById(id);
        if (!data) throw new HttpException("Id invalid", HttpStatus.NOT_FOUND);
        return convertDataResponse("OK", data);
    }

    async getByCustomer(customer: string) {
        const data = await this.orderModel.find({ customer }).lean();
        return convertDataResponse("OK", data);
    }

    async create(data: OrderDto) {
        try {
            const newOrder = await this.orderModel.create(data);
            return convertDataResponse("Create Success", newOrder);
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    async update(data: Partial<OrderDto>, id: string) {
        const updatedOrder = await this.orderModel.findByIdAndUpdate(id, data, {
            new: true,
        });
        if (!updatedOrder) {
            throw new HttpException("Id invalid", HttpStatus.NOT_FOUND);
        }
        return convertDataResponse("Update Success", updatedOrder);
    }

    async updateStatus(id: string, status: string) {
        if (!['pending', 'processing', 'shipped', 'delivered', 'canceled'].includes(status)) {
            throw new BadRequestException("Invalid status value");
        }

        const updatedOrder = await this.orderModel.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!updatedOrder) {
            throw new HttpException("Id invalid", HttpStatus.NOT_FOUND);
        }

        return convertDataResponse("Status updated", updatedOrder);
    }

    async delete(id: string) {
        const deleteSuccess = await this.orderModel.findByIdAndDelete(id);
        if (!deleteSuccess) {
            throw new HttpException("Id invalid", HttpStatus.NOT_FOUND);
        }
        return {
            msg: "Delete Success",
        };
    }
}
