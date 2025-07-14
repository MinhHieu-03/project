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
import { MasterDataDto, DeleteMultipleDto } from "src/dtos/MasterData.dto";
import { FilterQuery } from "src/ultil/type";
import { join } from "path";
import { createReadStream, existsSync } from "fs";
import { MasterDataService } from "./master_data.service";
import { ApiBearerAuth, ApiTags, ApiConsumes, ApiBody } from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";
import * as XLSX from "xlsx";
import { Multer } from "multer";

@ApiTags("Master Data")
@ApiBearerAuth()
@Controller("master-data")
export class MasterDataController {
  constructor(private masterDataService: MasterDataService) {}

  @Get("")
  getAll(@Query() params: any) {
    return this.masterDataService.getAll(params);
  }

  @Get(":id")
  getById(@Param("id") id: string) {
    return this.masterDataService.getById(id);
  }
  @Get("/material/:material_no")
  getByMaterialNo(@Param("material_no") material_no: string) {
    return this.masterDataService.getByMaterialNo(material_no);
  }

  @Post("/list")
  @UsePipes(ValidationPipe)
  getByFilter(@Body() data: FilterQuery) {
    return this.masterDataService.getByFilter(data);
  }

  @Post("")
  @UsePipes(new ValidationPipe())
  create(@Body() data: MasterDataDto) {
    return this.masterDataService.create(data);
  }

  @Patch(":id")
  @UsePipes(new ValidationPipe())
  update(@Body() dataUpdate: any, @Param("id") id: string) {
    return this.masterDataService.update(dataUpdate, id);
  }

  @Delete(":id")
  async delete(@Param("id") id: string) {
    return this.masterDataService.delete(id);
  }

  @Delete()
  @UsePipes(new ValidationPipe())
  async deleteMultiple(@Body() data: DeleteMultipleDto) {
    return this.masterDataService.deleteMultiple(data.ids);
  }

  @Get("/file/download")
  downloadExcel(@Res() res: any) {
    const filePath = join(process.cwd(), "public", "template_sku_demo.xlsx"); // Đường dẫn từ thư mục gốc

    if (!existsSync(filePath)) {
      return res.status(404).send("File not found");
    }

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=template_sku_demo.xlsx",
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );

    const fileStream = createReadStream(filePath);
    fileStream.pipe(res);
  }
  // uplopad file
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
    return this.masterDataService.processExcelFile(jsonData);
  }
}
