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
import { MaterialRecvDataDto } from "src/dtos/MaterialRecvData.dto";
import { FilterQuery } from "src/ultil/type";
import { join } from "path";
import { createReadStream, existsSync } from "fs";
import { MaterialRecvDataService } from "./material_recv_data.service";
import { ApiBearerAuth, ApiTags, ApiConsumes, ApiBody } from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";
import * as XLSX from "xlsx";
import { Multer } from "multer";

@ApiTags("Material Receive Data")
@ApiBearerAuth()
@Controller("material-recv-data")
export class MaterialRecvDataController {
    constructor(private materialRecvDataService: MaterialRecvDataService) { }

    @Get("")
    getAll(@Query() params: any) {
        return this.materialRecvDataService.getAll(params);
    }

    @Get(":id")
    getById(@Param("id") id: string) {
        return this.materialRecvDataService.getById(+id);
    }

    @Get("/material/:material_no")
    getByMaterialNo(@Param("material_no") material_no: string) {
        return this.materialRecvDataService.getByMaterialNo(material_no);
    }

    @Get("/pallet/:pallet_id")
    getByPalletId(@Param("pallet_id") pallet_id: string) {
        return this.materialRecvDataService.getByPalletId(pallet_id);
    }

    @Get("/invoice/:invoice_no")
    getByInvoiceNo(@Param("invoice_no") invoice_no: string) {
        return this.materialRecvDataService.getByInvoiceNo(invoice_no);
    }

    @Post("/list")
    @UsePipes(ValidationPipe)
    getByFilter(@Body() data: FilterQuery) {
        return this.materialRecvDataService.getByFilter(data);
    }

    @Post("")
    @UsePipes(new ValidationPipe())
    create(@Body() data: MaterialRecvDataDto) {
        return this.materialRecvDataService.create(data);
    }

    @Patch(":id")
    @UsePipes(new ValidationPipe())
    update(@Body() dataUpdate: any, @Param("id") id: string) {
        return this.materialRecvDataService.update(dataUpdate, +id);
    }

    @Delete(":id")
    async delete(@Param("id") id: string) {
        return this.materialRecvDataService.delete(+id);
    }

    @Get("/file/download")
    downloadExcel(@Res() res: any) {
        const filePath = join(process.cwd(), "public", "template_material_recv_data.xlsx");

        if (!existsSync(filePath)) {
            return res.status(404).send("File not found");
        }

        res.setHeader(
            "Content-Disposition",
            "attachment; filename=template_material_recv_data.xlsx",
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
        return this.materialRecvDataService.processExcelFile(jsonData);
    }
}
