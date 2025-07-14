import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";

export const STATUS_STOCK = {
  CONNECT: "connect",
  DISCONNECT: "disconnect",
};

@Schema({ timestamps: true })
export class System {
  @Prop({ unique: true, required: true })
  product_line: string;

  @Prop({ required: true })
  product: string;

  @Prop({ required: true })
  sku: string;
}

export const Systemschema = SchemaFactory.createForClass(System);
