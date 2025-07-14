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
import { InboundDto, UpdateInboundDto } from "src/dtos/Inbound.dto";
import { FilterQuery } from "src/ultil/type";
import { InboundService } from "./inbound.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiTags("Inbound")
@ApiBearerAuth()
@Controller("inbound")
export class InboundController {
    constructor(private inboundService: InboundService) { }

    @Get("")
    getAll(@Query() params: any) {
        return this.inboundService.getAll(params);
    }

    @Get(":id")
    getById(@Param("id") id: string, @Query("query") query: { [key: string]: any }) {
        return this.inboundService.getById(id, query);
    }

    @Post("/list")
    @UsePipes(ValidationPipe)
    getByFilter(@Body() data: FilterQuery) {
        return this.inboundService.getByFilter(data);
    }

    @Post("")
    @UsePipes(new ValidationPipe())
    create(@Req() request: any, @Body() data: InboundDto) {
        const { name } = request?.user;
        return this.inboundService.create(data, name);
    }

    @Patch(":id")
    @UsePipes(new ValidationPipe())
    update(@Body() dataUpdate: UpdateInboundDto, @Param("id") id: string) {
        return this.inboundService.update(dataUpdate, id);
    }

    @Delete(":id")
    async delete(@Param("id") id: string) {
        return this.inboundService.delete(id);
    }
}
