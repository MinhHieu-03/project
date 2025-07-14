import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { IssueDataController } from "./issue_data.controller";
import { IssueDataService } from "./issue_data.service";
import { MulterModule } from "@nestjs/platform-express";
import { IssueData } from "src/shemas/issue_data.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([IssueData]),
        MulterModule.register({
            limits: {
                fileSize: 10 * 1024 * 1024, // 10MB file size limit
            },
        }),
    ],
    controllers: [IssueDataController],
    providers: [IssueDataService],
    exports: [IssueDataService],
})
export class IssueDataModule { }
