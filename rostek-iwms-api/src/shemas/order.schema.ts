import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type OrderDocument = HydratedDocument<Order>;

@Schema({ timestamps: true })
export class Order {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    customer: string;

    @Prop({ default: Date.now })
    order_date: Date;

    @Prop()
    description: string;

    @Prop({
        required: true,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'canceled'],
        default: 'pending'
    })
    status: string;
}

const OrderSchema = SchemaFactory.createForClass(Order);
// Define additional indexes
OrderSchema.index({ customer: 1, order_date: -1 });
OrderSchema.index({ status: 1 });
export { OrderSchema };
