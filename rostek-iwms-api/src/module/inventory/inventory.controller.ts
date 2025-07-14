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
import { InventoryDto } from "src/dtos/Inventory.dto";
import { FilterQuery } from "src/ultil/type";
import { InventoryService } from "./inventory.service";
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from "@nestjs/swagger";
import { INVENTORY_STATUS } from "src/shemas/inventory.schema";

@ApiTags("Inventory")
@ApiBearerAuth()
@Controller("inventory")
export class InventoryController {
    constructor(private inventoryService: InventoryService) { }

    @Get("")
    getAll(@Query() params: any) {
        return this.inventoryService.getAll(params);
    }

    @Get(":id")
    getById(@Param("id") id: string) {
        return this.inventoryService.getById(id);
    }

    @Post("/list")
    @UsePipes(ValidationPipe)
    getByFilter(@Body() data: FilterQuery) {
        return this.inventoryService.getByFilter(data);
    }

    @Post("")
    @UsePipes(new ValidationPipe())
    create(@Body() data: InventoryDto) {
        return this.inventoryService.create(data);
    }

    @Patch(":id")
    @UsePipes(new ValidationPipe())
    update(@Body() dataUpdate: any, @Param("id") id: string) {
        return this.inventoryService.update(dataUpdate, id);
    }

    @Delete(":id")
    async delete(@Param("id") id: string) {
        return this.inventoryService.delete(id);
    }

    @Patch(":id/status")
    @ApiParam({ name: 'id', type: 'string' })
    @ApiBody({ schema: { properties: { status: { enum: Object.values(INVENTORY_STATUS) } } } })
    updateStatus(@Param("id") id: string, @Body("status") status: INVENTORY_STATUS) {
        return this.inventoryService.updateStatus(id, status);
    }
}
