import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Area, AreaSchema } from "src/shemas/area.schema";
import { LocationController } from "./location.controller";
import { LocationService } from "./location.service";
import { Location, LocationSchema } from "src/shemas/location.schema";
import {
  MissionHistory,
  MissionHistorychema,
} from "src/shemas/mission_history.schema";
import { AreaConfig, AreaConfigSchema } from "src/shemas/areaconfig.schema";
import { Inventory, InventorySchema } from "src/shemas/inventory.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Area.name,
        schema: AreaSchema,
      },
      {
        name: Location.name,
        schema: LocationSchema,
      },
      {
        name: MissionHistory.name,
        schema: MissionHistorychema,
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
  controllers: [LocationController],
  providers: [LocationService],
})
export class LocationModule {}
