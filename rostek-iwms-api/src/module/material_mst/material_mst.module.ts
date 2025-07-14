import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MaterialMstController } from "./material_mst.controller";
import { MaterialMstService } from "./material_mst.service";
import { MulterModule } from "@nestjs/platform-express";
import { MaterialMst } from "src/shemas/material_mst.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([MaterialMst]),
        MulterModule.register({
            limits: {
                fileSize: 10 * 1024 * 1024, // 10MB file size limit
            },
        }),
    ],
    controllers: [MaterialMstController],
    providers: [MaterialMstService],
    exports: [MaterialMstService],
})
export class MaterialMstModule { }
