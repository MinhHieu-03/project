import { Module } from "@nestjs/common";
import { CallBoxesService } from "./call_boxes.service";
import { CallBoxesController } from "./call_boxes.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { CallBoxes, CallBoxeschema } from "src/shemas/call_boxes.schema";
import { Location, LocationSchema } from "src/shemas/location.schema";
import {
  MissionHistory,
  MissionHistorychema,
} from "src/shemas/mission_history.schema";
import { Area, AreaSchema } from "src/shemas/area.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: CallBoxes.name,
        schema: CallBoxeschema,
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
        name: MissionHistory.name,
        schema: MissionHistorychema,
      },
    ]),
  ],
  providers: [CallBoxesService],
  controllers: [CallBoxesController],
})
export class CallBoxesModule { }
