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
import { IssueTimeScheduleDto } from "src/dtos/IssueTimeSchedule.dto";
import { FilterQuery } from "src/ultil/type";
import { join } from "path";
import { createReadStream, existsSync } from "fs";
import { IssueTimeScheduleService } from "./issue_time_schedule.service";
import { ApiBearerAuth, ApiTags, ApiConsumes, ApiBody } from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";
import * as XLSX from "xlsx";
import { Multer } from "multer";

@ApiTags("Issue Time Schedule")
@ApiBearerAuth()
@Controller("issue-time-schedule")
export class IssueTimeScheduleController {
  constructor(private issueTimeScheduleService: IssueTimeScheduleService) {}

  @Get("")
  getAll(@Query() params: any) {
    return this.issueTimeScheduleService.getAll(params);
  }

  @Get(":issue_ord_no")
  getById(@Param("issue_ord_no") issue_ord_no: string) {
    return this.issueTimeScheduleService.getById(issue_ord_no);
  }

  @Get("/prod/:prod_no")
  getByProdNo(@Param("prod_no") prod_no: string) {
    return this.issueTimeScheduleService.getByProdNo(prod_no);
  }

  @Get("/issord/:issord_no")
  getByIssordNo(@Param("issord_no") issord_no: string) {
    return this.issueTimeScheduleService.getByIssordNo(issord_no);
  }

  @Post("/list")
  @UsePipes(ValidationPipe)
  getByFilter(@Body() data: FilterQuery) {
    return this.issueTimeScheduleService.getByFilter(data);
  }

  @Post("/picking-order")
  @UsePipes(ValidationPipe)
  @ApiBody({
    description: "Picking order request",
    schema: {
      type: "object",
      properties: {
        issue_order_no: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Array of issue order numbers",
          example: ["ORDER001", "ORDER002", "ORDER003"],
        },
      },
      required: ["issue_order_no"],
    },
  })
  pickingOrder(@Body() data: { issue_order_no: string[] }) {
    return this.issueTimeScheduleService.pickingOrder(data);
  }

  @Post("")
  @UsePipes(new ValidationPipe())
  create(@Body() data: IssueTimeScheduleDto) {
    return this.issueTimeScheduleService.create(data);
  }

  @Patch(":issue_ord_no")
  @UsePipes(new ValidationPipe())
  update(@Body() dataUpdate: any, @Param("issue_ord_no") issue_ord_no: string) {
    return this.issueTimeScheduleService.update(dataUpdate, issue_ord_no);
  }

  @Delete(":issue_ord_no")
  async delete(@Param("issue_ord_no") issue_ord_no: string) {
    return this.issueTimeScheduleService.delete(issue_ord_no);
  }

  @Get("/file/download")
  downloadExcel(@Res() res: any) {
    const filePath = join(
      process.cwd(),
      "public",
      "template_issue_time_schedule.xlsx",
    );

    if (!existsSync(filePath)) {
      return res.status(404).send("File not found");
    }

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=template_issue_time_schedule.xlsx",
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
    return this.issueTimeScheduleService.processExcelFile(jsonData);
  }
}
