import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";

export const STATUS_MISSION = {
  REGISTERED: "registered",
  PROCESSING: "processing",
  ACCOMPLISHED: "accomplished",
  CANCEL: "cancel",
  PENDING: "pending ",
};

@Schema({ timestamps: true })
export class MissionHistory {
  @Prop({ required: true })
  mission_code: string;

  @Prop({ default: "" })
  robot_code?: string;

  @Prop({})
  pickup_location: string;

  @Prop({})
  return_location: string;

  @Prop()
  sector?: string;

  @Prop({ required: true })
  object_call: string;

  @Prop({ default: "" })
  mission_rcs?: string;

  @Prop({ default: "" })
  description?: string;

  @Prop({})
  call_boxes_id?: string;

  @Prop({ required: true, enum: Object.values(STATUS_MISSION) })
  current_state?: string;

  @Prop([
    {
      status: { type: String, enum: Object.values(STATUS_MISSION) },
      updateAt: { type: Date },
    },
  ])
  status_list: { status: string; updateAt: Date }[];
}

export const MissionHistorychema = SchemaFactory.createForClass(MissionHistory);
