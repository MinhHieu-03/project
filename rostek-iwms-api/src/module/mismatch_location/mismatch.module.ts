import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { MismatchLocationController } from "./mismatch.controller";
import { MismatchLocationService } from "./mismatch.service";
import {
  MismatchLocation,
  MismatchLocationschema,
} from "src/shemas/mismatch_location.schema";
import { Location, LocationSchema } from "src/shemas/location.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Location.name,
        schema: LocationSchema,
      },
      {
        name: MismatchLocation.name,
        schema: MismatchLocationschema,
      },
    ]),
  ],
  controllers: [MismatchLocationController],
  providers: [MismatchLocationService],
})
export class MismatchLocationModule { }
