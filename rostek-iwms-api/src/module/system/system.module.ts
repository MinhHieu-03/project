import { Module } from "@nestjs/common";
import { SystemController } from "./system.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { System, Systemschema } from "src/shemas/system.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: System.name,
        schema: Systemschema,
      },
    ]),
  ],
  controllers: [SystemController],
})
export class SystemModule {}
