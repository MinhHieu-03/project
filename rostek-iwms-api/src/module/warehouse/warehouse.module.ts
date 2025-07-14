import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Warehouse, Warehouseschema } from "src/shemas/warehouse.schema";
import { WarehouseController } from "./warehouse.controller";
import { WarehouseService } from "./warehouse.service";
// import { Location, LocationSchema } from 'src/shemas/location.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Warehouse.name,
        schema: Warehouseschema,
      },
    ]),
  ],
  controllers: [WarehouseController],
  providers: [WarehouseService],
})
export class WarehouseModule { }
