import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true })
export class Account {
  @Prop({ unique: true, required: true })
  name: string;

  @Prop({ required: true })
  password: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ required: true })
  role: string;

  @Prop({ required: true, default: "active" })
  status: string;

  @Prop({ required: true })
  department: string;

  @Prop({ default: Date.now() })
  recent_access: Date;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
