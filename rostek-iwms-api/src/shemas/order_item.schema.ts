import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";

@Schema({ timestamps: true })
export class OrderItem extends Document {
    @Prop({ required: true })
    sku: string;

    @Prop()
    unit: string;

    @Prop({ required: true })
    qty: number;

    @Prop()
    product_name: string;

    @Prop()
    price: number;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Order' })
    orderId: MongooseSchema.Types.ObjectId;
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);
