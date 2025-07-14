import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { OrderItemController } from "./order_item.controller";
import { OrderItemService } from "./order_item.service";
import { OrderItem, OrderItemSchema } from "src/shemas/order_item.schema";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: OrderItem.name, schema: OrderItemSchema },
        ]),
    ],
    controllers: [OrderItemController],
    providers: [OrderItemService],
    exports: [OrderItemService],
})
export class OrderItemModule { }
