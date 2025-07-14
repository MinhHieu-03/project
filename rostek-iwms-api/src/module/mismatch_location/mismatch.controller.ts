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
  Req,
} from "@nestjs/common";
import { MismatchLocationDto } from "src/dtos/MismatchLocation.dto";
import { FilterQuery } from "src/ultil/type";
import { MismatchLocationService } from "./mismatch.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiTags("Đồng bộ")
@ApiBearerAuth()
@Controller("mismatch")
export class MismatchLocationController {
  constructor(private mismatchService: MismatchLocationService) {}

  @Get("")
  getMismatchList() {
    return this.mismatchService.getAll();
  }

  @Post("/list")
  @UsePipes(ValidationPipe)
  getUserByFilter(@Body() data: FilterQuery) {
    return this.mismatchService.getByFilter(data);
  }

  @Post("")
  checkMismatch() {
    return this.mismatchService.checkMismatch();
  }

  @Post("wcs")
  wcsReport(@Body() data: MismatchLocationDto) {
    return this.mismatchService.updateMismatch(data);
  }

  @Post("wcs/done")
  wcsReportDone() {
    return this.mismatchService.stopCheck();
  }
}
