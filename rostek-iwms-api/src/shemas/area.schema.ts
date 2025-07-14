import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { Warehouse } from "./warehouse.schema";
import { AreaConfig } from "./areaconfig.schema";

export const AREA = {
  INPUT_AREA: "input_warehouse",
  OUT_AREA: "out_warehouse",
};

export const STATUS_AREA = {
  EMPTY: "empty",
  FULL: "full",
};

@Schema({ timestamps: true })
export class Area {
  @Prop({ required: true })
  location_code: string;

  @Prop({ required: true })
  row: number;

  @Prop({ required: true })
  column: number;

  @Prop({ required: true, enum: Object.values(STATUS_AREA) })
  status: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Warehouse" })
  warehouse: Warehouse;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "AreaConfig" })
  area_config: AreaConfig;
}

export const AreaSchema = SchemaFactory.createForClass(Area);
