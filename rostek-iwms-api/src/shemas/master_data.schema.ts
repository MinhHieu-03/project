import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type MasterDataDocument = HydratedDocument<MasterData>;

@Schema({ timestamps: true })
export class MasterData {
  @Prop({ required: true })
  material_no: string;

  @Prop({ required: true })
  material_nm: string;

  @Prop({ required: true })
  material_tp: string;

  @Prop({})
  pk_style: number;

  @Prop({})
  new_pk_style: number;

  
  @Prop({})
  pcs_bag: number;

  @Prop({})
  flg: number;

  @Prop()
  comment: string;

  @Prop({})
  user_id: string;

  @Prop({ default: Date.now })
  ent_dt: Date;

  @Prop({ default: Date.now })
  upd_dt: Date;
}

const MasterDataSchema = SchemaFactory.createForClass(MasterData);
// Define additional indexes
MasterDataSchema.index({ material_no: 1 });
export { MasterDataSchema };
