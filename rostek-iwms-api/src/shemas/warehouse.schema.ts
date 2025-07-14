import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true })
export class Warehouse {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: false })
  description: string;
}

export const Warehouseschema = SchemaFactory.createForClass(Warehouse);
