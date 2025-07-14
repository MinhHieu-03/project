import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Inbound, InboundSchema } from "src/shemas/inbound.schema";
import { InboundController } from "./inbound.controller";
import { InboundService } from "./inbound.service";

import { Area, AreaSchema } from "src/shemas/area.schema";
import { Location, LocationSchema } from "src/shemas/location.schema";
import { AreaConfig, AreaConfigSchema } from "src/shemas/areaconfig.schema";
import { Inventory, InventorySchema } from "src/shemas/inventory.schema";

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Inbound.name,
                schema: InboundSchema,
            },

            {
                name: Area.name,
                schema: AreaSchema,
            },
            {
                name: Location.name,
                schema: LocationSchema,
            },
            {
                name: AreaConfig.name,
                schema: AreaConfigSchema,
            },
            {
                name: Inventory.name,
                schema: InventorySchema,
            },
        ]),
    ],
    controllers: [InboundController],
    providers: [InboundService],
})
export class InboundModule { }
