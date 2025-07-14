import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    UsePipes,
    ValidationPipe,
    Query,
} from "@nestjs/common";
import { OrderItemDto } from "src/dtos/OrderItem.dto";
import { FilterQuery } from "src/ultil/type";
import { OrderItemService } from "./order_item.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiTags("Order Items")
@ApiBearerAuth()
@Controller("order-items")
export class OrderItemController {
    constructor(private orderItemService: OrderItemService) { }

    @Get("")
    getAll(@Query() params: any) {
        return this.orderItemService.getAll(params);
    }

    @Get(":id")
    getById(@Param("id") id: string) {
        return this.orderItemService.getById(id);
    }

    @Get("/order/:orderId")
    getByOrderId(@Param("orderId") orderId: string) {
        return this.orderItemService.getByOrderId(orderId);
    }

    @Post("/list")
    @UsePipes(ValidationPipe)
    getByFilter(@Body() data: FilterQuery) {
        return this.orderItemService.getByFilter(data);
    }

    @Post("")
    @UsePipes(new ValidationPipe())
    create(@Body() data: OrderItemDto) {
        return this.orderItemService.create(data);
    }

    @Patch(":id")
    @UsePipes(new ValidationPipe())
    update(@Body() dataUpdate: any, @Param("id") id: string) {
        return this.orderItemService.update(dataUpdate, id);
    }

    @Delete(":id")
    async delete(@Param("id") id: string) {
        return this.orderItemService.delete(id);
    }
}
