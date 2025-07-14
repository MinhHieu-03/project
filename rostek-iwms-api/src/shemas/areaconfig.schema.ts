import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema({ timestamps: true })
export class AreaConfig {
    @Prop({ required: true })
    name: string;

    @Prop({ required: false })
    description: string;

    @Prop({ required: true, type: [String] })
    productions: string[];

    @Prop({ required: false, type: Object })
    settings: Record<string, any>;

    @Prop({ type: Types.ObjectId, ref: 'Warehouse', required: false })
    warehouse: Types.ObjectId;

    @Prop({ default: true })
    isActive: boolean;
}

export const AreaConfigSchema = SchemaFactory.createForClass(AreaConfig);
