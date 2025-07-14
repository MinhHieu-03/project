import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Area, AreaSchema } from "src/shemas/area.schema";
import { Location, LocationSchema } from "src/shemas/location.schema";
import { Warehouse, Warehouseschema } from "src/shemas/warehouse.schema";
import { AreaConfig, AreaConfigSchema } from "src/shemas/areaconfig.schema";
import { AreaController } from "./area.controller";
import { AreaService } from "./area.service";

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
        name: Warehouse.name,
        schema: Warehouseschema,
      },
      {
        name: AreaConfig.name,
        schema: AreaConfigSchema,
      },
    ]),
  ],
  controllers: [AreaController],
  providers: [AreaService],
})
export class AreaModule { }
