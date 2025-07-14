import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { StorageModel, StorageModelSchema } from "src/shemas/storage_model.schema";
import { StorageModelController } from "./storage_model.controller";
import { StorageModelService } from "./storage_model.service";

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: StorageModel.name,
                schema: StorageModelSchema,
            },
        ]),
    ],
    controllers: [StorageModelController],
    providers: [StorageModelService],
})
export class StorageModelModule { } 