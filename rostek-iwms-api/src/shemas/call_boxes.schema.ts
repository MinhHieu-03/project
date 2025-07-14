import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";

export const STATUS_STOCK = {
  CONNECT: 1,
  DISCONNECT: 0,
};

export const STATUS_ACTION = {
  CALL_RED_BTN: 0,
  CALL_GREEN_BTN: 1,
  CANCEL: 2,
};
@Schema({ timestamps: true })
export class CallBoxes {
  @Prop({ required: true })
  call_boxes_code: string;

  @Prop({ required: true })
  deviceId: string;

  @Prop({ required: true })
  rcs_code: string;

  @Prop({ required: true })
  sectors: string;

  @Prop({ required: true })
  location: string;

  @Prop({ required: true })
  gateway_id: string;

  @Prop({ required: true })
  plc_id: string;

  @Prop({
    enum: Object.values(STATUS_STOCK),
    default: STATUS_STOCK.CONNECT,
  })
  status_connect?: number;

  @Prop({
    enum: Object.values(STATUS_ACTION),
  })
  status_action?: number;
}

export const CallBoxeschema = SchemaFactory.createForClass(CallBoxes);
