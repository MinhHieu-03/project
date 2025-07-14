import { MissionHistoryService } from "./mission_history.service";
import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { MissionHistoryDto } from "src/dtos/MissionHistory.dto";
import { FilterQuery } from "src/ultil/type";

@ApiTags("Lịch sử thực hiện nhiệm vụ")
@ApiBearerAuth()
@Controller("mission_history")
export class MissionHistoryController {
  constructor(private missionService: MissionHistoryService) {}

  @Get("/download")
  @Header(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  )
  @Header(
    "Content-Disposition",
    "attachment; filename=" + "mission_history.xlsx",
  )
  async downloadReport(@Res() res: Response, @Query() query: any) {
    return this.missionService.downloadExcel(query, res);
  }
  @Get("")
  getAll() {
    return this.missionService.getAll();
  }

  @Get("/dal")
  getAllDal(@Query("current_state") current_state) {
    return this.missionService.getAllDal(current_state);
  }

  @Get(":id")
  getById(@Param("id") id: string) {
    return this.missionService.getById(id);
  }

  @Post("/list")
  @UsePipes(ValidationPipe)
  getUserByFilter(@Body() data: FilterQuery) {
    return this.missionService.getUserByFilter(data);
  }
  @Post("")
  @UsePipes(new ValidationPipe())
  create(@Body() data: MissionHistoryDto) {
    return this.missionService.create(data);
  }

  @Patch("")
  @UsePipes(new ValidationPipe())
  update(@Body() dataUpdate: any) {
    return this.missionService.update(dataUpdate);
  }

  @Delete(":id")
  async deleteMenu(@Param("id") id: string) {
    return this.missionService.delete(id);
  }
}
