import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { STATUS_LOCATION } from "src/shemas/location.schema";

export const RCS_STATUS_LOCATION = {
  DISABLE: "disable",
  EMPTY: "empty",
  LOCKED: "locked",
  FILLED: "full",
};

@Schema({ timestamps: true })
export class MismatchLocation {
  @Prop({ required: true })
  name: string;

  @Prop({ enum: Object.values(STATUS_LOCATION) })
  status: string;

  @Prop({ enum: Object.values(RCS_STATUS_LOCATION) })
  rcs_status: string;
}

export const MismatchLocationschema =
  SchemaFactory.createForClass(MismatchLocation);
