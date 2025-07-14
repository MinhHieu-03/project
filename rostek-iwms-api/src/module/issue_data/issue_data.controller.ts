import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    UsePipes,
    ValidationPipe,
    Query,
    UploadedFile,
    Res,
    UseInterceptors,
} from "@nestjs/common";
import { IssueDataDto } from "src/dtos/IssueData.dto";
import { FilterQuery } from "src/ultil/type";
import { join } from "path";
import { createReadStream, existsSync } from "fs";
import { IssueDataService } from "./issue_data.service";
import { ApiBearerAuth, ApiTags, ApiConsumes, ApiBody } from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";
import * as XLSX from "xlsx";
import { Multer } from "multer";

@ApiTags("Issue Data")
@ApiBearerAuth()
@Controller("issue-data")
export class IssueDataController {
    constructor(private issueDataService: IssueDataService) { }

    @Get("")
    getAll(@Query() params: any) {
        return this.issueDataService.getAll(params);
    }

    @Get(":id")
    getById(@Param("id") id: string) {
        return this.issueDataService.getById(+id);
    }

    @Get("/issord/:issord_no")
    getByIssordNo(@Param("issord_no") issord_no: string) {
        return this.issueDataService.getByIssordNo(issord_no);
    }

    @Post("/list")
    @UsePipes(ValidationPipe)
    getByFilter(@Body() data: FilterQuery) {
        return this.issueDataService.getByFilter(data);
    }

    @Post("")
    @UsePipes(new ValidationPipe())
    create(@Body() data: IssueDataDto) {
        return this.issueDataService.create(data);
    }

    @Patch(":id")
    @UsePipes(new ValidationPipe())
    update(@Body() dataUpdate: any, @Param("id") id: string) {
        return this.issueDataService.update(dataUpdate, +id);
    }

    @Delete(":id")
    async delete(@Param("id") id: string) {
        return this.issueDataService.delete(+id);
    }

    @Get("/file/download")
    downloadExcel(@Res() res: any) {
        const filePath = join(process.cwd(), "public", "template_issue_data.xlsx");

        if (!existsSync(filePath)) {
            return res.status(404).send("File not found");
        }

        res.setHeader(
            "Content-Disposition",
            "attachment; filename=template_issue_data.xlsx",
        );
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        );

        const fileStream = createReadStream(filePath);
        fileStream.pipe(res);
    }

    @Post("/import")
    @ApiConsumes("multipart/form-data")
    @ApiBody({
        schema: {
            type: "object",
            properties: {
                file: {
                    type: "string",
                    format: "binary",
                },
            },
        },
    })
    @UseInterceptors(FileInterceptor("file"))
    async uploadAndReadExcel(@UploadedFile() file: Multer.File) {
        if (!file) {
            return { message: "No file uploaded" };
        }
        const workbook = XLSX.read(file.buffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        return this.issueDataService.processExcelFile(jsonData);
    }
}
