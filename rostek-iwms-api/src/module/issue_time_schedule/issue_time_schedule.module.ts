import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { IssueTimeScheduleController } from "./issue_time_schedule.controller";
import { IssueTimeScheduleService } from "./issue_time_schedule.service";
import { MulterModule } from "@nestjs/platform-express";
import { IssueTimeSchedule } from "src/shemas/issue_time_schedule.entity";
import { IssueData } from "src/shemas/issue_data.entity";

import { MongooseModule } from "@nestjs/mongoose";
import { Area, AreaSchema } from "src/shemas/area.schema";
import { Location, LocationSchema } from "src/shemas/location.schema";
import {
  MissionHistory,
  MissionHistorychema,
} from "src/shemas/mission_history.schema";
import { AreaConfig, AreaConfigSchema } from "src/shemas/areaconfig.schema";
import { Inventory, InventorySchema } from "src/shemas/inventory.schema";

@Module({
  imports: [
    TypeOrmModule.forFeature([IssueTimeSchedule, IssueData]),

    MongooseModule.forFeature([
      {
        name: Location.name,
        schema: LocationSchema,
      },
      {
        name: MissionHistory.name,
        schema: MissionHistorychema,
      },
      {
        name: Inventory.name,
        schema: InventorySchema,
      },
    ]),
    MulterModule.register({
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB file size limit
      },
    }),
  ],
  controllers: [IssueTimeScheduleController],
  providers: [IssueTimeScheduleService],
  exports: [IssueTimeScheduleService],
})
export class IssueTimeScheduleModule {}
