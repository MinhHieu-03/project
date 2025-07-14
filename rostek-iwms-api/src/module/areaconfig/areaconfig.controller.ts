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
} from "@nestjs/common";
import { AreaConfigDto } from "src/dtos/AreaConfig.dto";
import { FilterQuery } from "src/ultil/type";
import { AreaConfigService } from "./areaconfig.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiTags("Area Configuration")
@ApiBearerAuth()
@Controller("areaconfig")
export class AreaConfigController {
  constructor(private areaConfigService: AreaConfigService) { }

  @Get("")
  getAll() {
    return this.areaConfigService.getAll();
  }

  @Get(":id")
  getById(@Param("id") id: string) {
    return this.areaConfigService.getById(id);
  }

  @Post("/list")
  @UsePipes(ValidationPipe)
  getByFilter(@Body() data: FilterQuery) {
    return this.areaConfigService.getByFilter(data);
  }

  @Post("")
  @UsePipes(new ValidationPipe())
  create(@Body() data: AreaConfigDto) {
    return this.areaConfigService.create(data);
  }

  @Patch(":id")
  @UsePipes(new ValidationPipe())
  update(@Body() dataUpdate: any, @Param("id") id: string) {
    return this.areaConfigService.update(dataUpdate, id);
  }

  @Delete(":id")
  async delete(@Param("id") id: string) {
    return this.areaConfigService.delete(id);
  }

  @Delete()
  @UsePipes(new ValidationPipe())
  async deleteMany(@Body() data: { ids: string[] }) {
    return this.areaConfigService.deleteMany(data.ids);
  }
}
