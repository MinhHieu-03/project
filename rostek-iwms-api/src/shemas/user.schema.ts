// users.schema.ts
import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'users', timestamps: true })   // 👈 collection = users
export class User extends Document {
  @Prop({ unique: true, required: true })
  name: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, enum: ['admin', 'manager', 'operator'] })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
