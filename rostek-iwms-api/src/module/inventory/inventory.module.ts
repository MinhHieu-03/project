import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Inventory, InventorySchema } from "src/shemas/inventory.schema";
import { InventoryController } from "./inventory.controller";
import { InventoryService } from "./inventory.service";

import { Area, AreaSchema } from "src/shemas/area.schema";
import { Location, LocationSchema } from "src/shemas/location.schema";
import { AreaConfig, AreaConfigSchema } from "src/shemas/areaconfig.schema";

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Inventory.name,
                schema: InventorySchema,
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
        ]),
    ],
    controllers: [InventoryController],
    providers: [InventoryService],
})
export class InventoryModule { }
