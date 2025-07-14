import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CallBoxesDto } from "src/dtos/CallBoxes.dto";
import { FilterQuery } from "src/ultil/type";
import { CallBoxesService } from "./call_boxes.service";
import { PermissionGuard } from "src/common/guards/permission.guard";

@ApiTags("Bộ gọi thủ công")
@ApiBearerAuth()
@UseGuards(new PermissionGuard(""))
@Controller("call_boxes")
export class CallBoxesController {
  constructor(private callBoxesService: CallBoxesService) {}

  @Get("")
  getAll() {
    return this.callBoxesService.getAll();
  }

  @Get(":id")
  getById(@Param("id") id: string) {
    return this.callBoxesService.getById(id);
  }

  @Cron("0 */2 * * * *")
  handleCron() {
    this.callBoxesService.checkConnectCallBox();
  }

  @Post("/list")
  @UsePipes(ValidationPipe)
  getUserByFilter(@Body() data: FilterQuery) {
    return this.callBoxesService.getUserByFilter(data);
  }
  @Post("")
  @UsePipes(new ValidationPipe())
  create(@Body() callSetData: CallBoxesDto) {
    return this.callBoxesService.create(callSetData);
  }

  @Patch("/update_status_connect/dal")
  @UsePipes(new ValidationPipe())
  updateWithDal(@Body() dataUpdate: any) {
    return this.callBoxesService.updateWithDal(dataUpdate);
  }

  @Patch("/update_status_action/dal")
  @UsePipes(new ValidationPipe())
  updateWithDalAction(@Body() dataUpdate: any) {
    return this.callBoxesService.updateWithDalAction(dataUpdate);
  }

  @Patch("/update_status_curtain_wrap/dal")
  @UsePipes(new ValidationPipe())
  updateWithDalActionCurtainWrap(@Body() dataUpdate: any) {
    return this.callBoxesService.updateWithDalActionCurtainWrap(dataUpdate);
  }

  @Patch(":id")
  @UsePipes(new ValidationPipe())
  update(@Body() dataUpdate: any, @Param("id") id: string) {
    return this.callBoxesService.update(dataUpdate, id);
  }

  @Delete(":id")
  async deleteMenu(@Param("id") id: string) {
    return this.callBoxesService.delete(id);
  }
}
