import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type StorageModelDocument = StorageModel & Document;

@Schema({ timestamps: true })
export class StorageModel {
    @Prop({ type: [Object] })
    edges: Record<string, any>[];

    @Prop({ type: [Object] })
    nodes: Record<string, any>[];

    @Prop({ type: [Object] })
    storage_unit: Record<string, any>[];
}

export const StorageModelSchema = SchemaFactory.createForClass(StorageModel); 