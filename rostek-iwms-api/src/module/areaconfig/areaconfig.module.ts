import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AreaConfig, AreaConfigSchema } from "src/shemas/areaconfig.schema";
import { Warehouse, Warehouseschema } from "src/shemas/warehouse.schema";
import { AreaConfigController } from "./areaconfig.controller";
import { AreaConfigService } from "./areaconfig.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: AreaConfig.name,
        schema: AreaConfigSchema,
      },
      {
        name: Warehouse.name,
        schema: Warehouseschema,
      },
    ]),
  ],
  controllers: [AreaConfigController],
  providers: [AreaConfigService],
})
export class AreaConfigModule { }
