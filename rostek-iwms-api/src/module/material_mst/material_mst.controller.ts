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
import { MaterialMstDto } from "src/dtos/MaterialMst.dto";
import { FilterQuery } from "src/ultil/type";
import { join } from "path";
import { createReadStream, existsSync } from "fs";
import { MaterialMstService } from "./material_mst.service";
import { ApiBearerAuth, ApiTags, ApiConsumes, ApiBody } from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";
import * as XLSX from "xlsx";
import { Multer } from "multer";

@ApiTags("Material MST")
@ApiBearerAuth()
@Controller("material-mst")
export class MaterialMstController {
    constructor(private materialMstService: MaterialMstService) { }

    @Get("")
    getAll(@Query() params: any) {
        return this.materialMstService.getAll(params);
    }

    @Get(":id")
    getById(@Param("id") id: string) {
        return this.materialMstService.getById(+id);
    }

    @Get("/material/:material_no")
    getByMaterialNo(@Param("material_no") material_no: string) {
        return this.materialMstService.getByMaterialNo(material_no);
    }

    @Post("/list")
    @UsePipes(ValidationPipe)
    getByFilter(@Body() data: FilterQuery) {
        return this.materialMstService.getByFilter(data);
    }

    @Post("")
    @UsePipes(new ValidationPipe())
    create(@Body() data: MaterialMstDto) {
        return this.materialMstService.create(data);
    }

    @Patch(":id")
    @UsePipes(new ValidationPipe())
    update(@Body() dataUpdate: any, @Param("id") id: string) {
        return this.materialMstService.update(dataUpdate, +id);
    }

    @Delete(":id")
    async delete(@Param("id") id: string) {
        return this.materialMstService.delete(+id);
    }

    @Get("/file/download")
    downloadExcel(@Res() res: any) {
        const filePath = join(process.cwd(), "public", "template_material_mst.xlsx");

        if (!existsSync(filePath)) {
            return res.status(404).send("File not found");
        }

        res.setHeader(
            "Content-Disposition",
            "attachment; filename=template_material_mst.xlsx",
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
        return this.materialMstService.processExcelFile(jsonData);
    }
}
