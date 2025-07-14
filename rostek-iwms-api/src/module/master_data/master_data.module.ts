import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { MasterDataController } from "./master_data.controller";
import { MasterDataService } from "./master_data.service";
import { MulterModule } from "@nestjs/platform-express";
import { MasterData, MasterDataSchema } from "src/shemas/master_data.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MasterData.name, schema: MasterDataSchema },
    ]),
    MulterModule.register({
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB file size limit
      },
    }),
  ],
  controllers: [MasterDataController],
  providers: [MasterDataService],
  exports: [MasterDataService],
})
export class MasterDataModule {}
