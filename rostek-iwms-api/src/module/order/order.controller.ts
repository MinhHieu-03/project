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
import { OrderDto } from "src/dtos/Order.dto";
import { FilterQuery } from "src/ultil/type";
import { OrderService } from "./order.service";
import { ApiBearerAuth, ApiTags, ApiParam, ApiBody } from "@nestjs/swagger";

@ApiTags("Orders")
@ApiBearerAuth()
@Controller("orders")
export class OrderController {
    constructor(private orderService: OrderService) { }

    @Get("")
    getAll(@Query() params: any) {
        return this.orderService.getAll(params);
    }

    @Get(":id")
    getById(@Param("id") id: string) {
        return this.orderService.getById(id);
    }

    @Get("/customer/:customer")
    getByCustomer(@Param("customer") customer: string) {
        return this.orderService.getByCustomer(customer);
    }

    @Post("/list")
    @UsePipes(ValidationPipe)
    getByFilter(@Body() data: FilterQuery) {
        return this.orderService.getByFilter(data);
    }

    @Post("")
    @UsePipes(new ValidationPipe())
    create(@Body() data: OrderDto) {
        return this.orderService.create(data);
    }

    @Patch(":id")
    @UsePipes(new ValidationPipe())
    update(@Body() dataUpdate: Partial<OrderDto>, @Param("id") id: string) {
        return this.orderService.update(dataUpdate, id);
    }

    @Patch(":id/status/:status")
    @ApiParam({ name: 'status', enum: ['pending', 'processing', 'shipped', 'delivered', 'canceled'] })
    updateStatus(
        @Param("id") id: string,
        @Param("status") status: string
    ) {
        return this.orderService.updateStatus(id, status);
    }

    @Delete(":id")
    async delete(@Param("id") id: string) {
        return this.orderService.delete(id);
    }
}
