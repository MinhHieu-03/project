import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MaterialRecvDataController } from "./material_recv_data.controller";
import { MaterialRecvDataService } from "./material_recv_data.service";
import { MulterModule } from "@nestjs/platform-express";
import { MaterialRecvData } from "src/shemas/material_recv_data.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([MaterialRecvData]),
        MulterModule.register({
            limits: {
                fileSize: 10 * 1024 * 1024, // 10MB file size limit
            },
        }),
    ],
    controllers: [MaterialRecvDataController],
    providers: [MaterialRecvDataService],
    exports: [MaterialRecvDataService],
})
export class MaterialRecvDataModule { }
