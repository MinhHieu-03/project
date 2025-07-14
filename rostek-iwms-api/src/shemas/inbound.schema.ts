import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";

@Schema({ timestamps: true })
export class Inbound extends Document {
    @Prop()
    pic: string;

    @Prop({ required: true })
    sku: string;

    @Prop({ required: true })
    origin: string;

    @Prop({ required: false })
    product_name: string;

    @Prop({ required: true })
    destination: string;

    @Prop()
    status: string;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Location' })
    location: MongooseSchema.Types.ObjectId;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Inventory' })
    inventory: MongooseSchema.Types.ObjectId;
}

export const InboundSchema = SchemaFactory.createForClass(Inbound);
