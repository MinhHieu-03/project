import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Outbound, OutboundSchema } from "src/shemas/outbound.schema";
import { Inventory, InventorySchema } from "src/shemas/inventory.schema";
import { Location, LocationSchema } from "src/shemas/location.schema";
import { OutboundController } from "./outbound.controller";
import { OutboundService } from "./outbound.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Outbound.name,
        schema: OutboundSchema,
      },
      {
        name: Inventory.name,
        schema: InventorySchema,
      },
      {
        name: Location.name,
        schema: LocationSchema,
      },
    ]),
  ],
  controllers: [OutboundController],
  providers: [OutboundService],
})
export class OutboundModule {}
