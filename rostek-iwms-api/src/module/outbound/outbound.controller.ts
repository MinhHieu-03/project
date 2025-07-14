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
  Req,
} from "@nestjs/common";
import { OutboundDto } from "src/dtos/Outbound.dto";
import { FilterQuery } from "src/ultil/type";
import { OutboundService } from "./outbound.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiTags("Outbound")
@ApiBearerAuth()
@Controller("outbound")
export class OutboundController {
  constructor(private outboundService: OutboundService) {}

  @Get("")
  getAll(@Query() params: any) {
    return this.outboundService.getAll(params);
  }

  @Get(":id")
  getById(@Param("id") id: string) {
    return this.outboundService.getById(id);
  }

  @Post("/list")
  @UsePipes(ValidationPipe)
  getByFilter(@Body() data: FilterQuery) {
    return this.outboundService.getByFilter(data);
  }

  @Post("")
  @UsePipes(new ValidationPipe())
  create(@Req() request: any, @Body() data: OutboundDto) {
    const { name } = request?.user;
    return this.outboundService.create(data, name);
  }

  @Patch(":id")
  @UsePipes(new ValidationPipe())
  update(@Body() dataUpdate: any, @Param("id") id: string) {
    return this.outboundService.update(dataUpdate, id);
  }

  @Delete(":id")
  async delete(@Param("id") id: string) {
    return this.outboundService.delete(id);
  }
}
