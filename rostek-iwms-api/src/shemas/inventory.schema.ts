import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";
import { Location } from "./location.schema";

export enum INVENTORY_STATUS {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    PENDING = 'PENDING',
    DAMAGED = 'DAMAGED',
    RESERVED = 'RESERVED',
    WAIT_FILL = 'wait_fill',
}

interface StoreItem {
    key: string;
    qty: number;
}

@Schema({ timestamps: true })
export class Inventory extends Document {
    @Prop({ required: true, index: true })
    sku: string;

    @Prop({ required: false })
    product_name: string;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Location', required: true })
    locationId: Location | string;

    @Prop({ required: true })
    locationCode: string;

    @Prop({})
    binCode: string;

    @Prop({ type: [Object], required: true })
    store: StoreItem[];

    @Prop({ type: String, enum: INVENTORY_STATUS, default: INVENTORY_STATUS.ACTIVE })
    status: INVENTORY_STATUS;

    @Prop({ type: Number, default: 0 })
    available: number;
}

export const InventorySchema = SchemaFactory.createForClass(Inventory);
