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
} from "@nestjs/common";
import { StorageModelDto } from "src/dtos/StorageModel.dto";
import { FilterQuery } from "src/ultil/type";
import { StorageModelService } from "./storage_model.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiTags("Storage Model")
@ApiBearerAuth()
@Controller("storage-model")
export class StorageModelController {
    constructor(private storageModelService: StorageModelService) { }

    @Get("")
    getAll(@Query() params: any) {
        return this.storageModelService.getAll(params);
    }

    @Get(":id")
    getById(@Param("id") id: string) {
        return this.storageModelService.getById(id);
    }

    @Post("/list")
    @UsePipes(ValidationPipe)
    getByFilter(@Body() data: FilterQuery) {
        return this.storageModelService.getByFilter(data);
    }

    @Post("")
    // @UsePipes(new ValidationPipe())
    create(@Body() data: StorageModelDto) {
        return this.storageModelService.create(data);
    }

    @Patch(":id")
    @UsePipes(new ValidationPipe())
    update(@Body() dataUpdate: any, @Param("id") id: string) {
        return this.storageModelService.update(dataUpdate, id);
    }

    @Delete(":id")
    async delete(@Param("id") id: string) {
        return this.storageModelService.delete(id);
    }
} 