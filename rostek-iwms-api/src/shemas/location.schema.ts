import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { AREA } from "./area.schema";
import { SECTORS } from "src/helpers/const";
import * as mongoose from "mongoose";
import { AreaConfig } from "./areaconfig.schema";
import { Area } from "./area.schema";
import { Inventory } from "./inventory.schema";

export const STATUS_LOCATION = {
  AVAILABLE: "available",
  UNAVAILABLE: "unavailable",
  DISABLED: "disable",
  FILL: "fill",
  WAIT_FILL: "wait_fill",
  CANCELLED: "cancelled",
};

@Schema({ timestamps: true })
export class Location {
  @Prop({ required: true, unique: true })
  code: string;

  @Prop({})
  skus?: string[];

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: "Area" })
  areaId: Area;

  @Prop({})
  areaCode?: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "AreaConfig" })
  area_config: AreaConfig;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Inventory" })
  inventory: Inventory;

  @Prop({
    enum: Object.values(STATUS_LOCATION),
    default: STATUS_LOCATION.AVAILABLE,
  })
  status: string;
}

export const LocationSchema = SchemaFactory.createForClass(Location);
