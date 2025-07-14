import { Module } from "@nestjs/common";
import { MissionHistoryController } from "./mission_history.controller";
import { MissionHistoryService } from "./mission_history.service";
import { MongooseModule } from "@nestjs/mongoose";
import {
  MissionHistory,
  MissionHistorychema,
} from "src/shemas/mission_history.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: MissionHistory.name,
        schema: MissionHistorychema,
      },
    ]),
  ],
  controllers: [MissionHistoryController],
  providers: [MissionHistoryService],
})
export class MissionHistoryModule {}
