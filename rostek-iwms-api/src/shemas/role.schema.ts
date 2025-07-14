import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true })
export class Role {
  @Prop({ unique: true, required: true })
  name: string;

  @Prop({ required: true })
  describe: string;

  @Prop({ type: Object })
  permission: Object;
}

export const Roleschema = SchemaFactory.createForClass(Role);
