import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";

@Schema({ timestamps: true })
export class Outbound extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId })
  order_id: MongooseSchema.Types.ObjectId;

  @Prop({})
  bin_code: string;

  @Prop({ required: true })
  sku: string;

  @Prop({ required: true })
  qty: number;

  @Prop({ required: true })
  unit: string;

  @Prop({ required: true })
  location: string;

  @Prop({ required: true })
  status: string;

  @Prop({ type: MongooseSchema.Types.ObjectId })
  mission: MongooseSchema.Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: "Inventory",
  })
  inventory: MongooseSchema.Types.ObjectId;
}

export const OutboundSchema = SchemaFactory.createForClass(Outbound);
