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
import { WarehouseDto } from "src/dtos/Warehouse.dto";
import { FilterQuery } from "src/ultil/type";
import { WarehouseService } from "./warehouse.service";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("Phân Kho")
@ApiBearerAuth()
@Controller("warehouse")
export class WarehouseController {
  constructor(private warehouseService: WarehouseService) { }

  @Get("")
  getAll() {
    return this.warehouseService.getAll();
  }

  @Get(":id")
  getById(@Param("id") id: string) {
    return this.warehouseService.getById(id);
  }

  @Post("/list")
  @UsePipes(ValidationPipe)
  @ApiOperation({ summary: 'Get warehouses by filter criteria' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        page: {
          type: 'number',
          example: 1,
          description: 'Page number',
        },
        limit: {
          type: 'number',
          example: 10,
          description: 'Number of records per page',
        },
        sortBy: {
          type: 'string',
          example: 'createdAt',
          description: 'Field to sort by',
        },
        sortOrder: {
          type: 'string',
          example: 'DESC',
          enum: ['ASC', 'DESC'],
          description: 'Sort direction',
        },
        filter: {
          type: 'object',
          example: { name: 'Kho A' },
          description: 'Filter criteria',
        },
      },
    },
  })
  paginationAndFilter(@Body() data: FilterQuery) {
    return this.warehouseService.paginationAndFilter(data);
  }
  @Post("")
  @UsePipes(new ValidationPipe())
  create(@Body() data: WarehouseDto) {
    return this.warehouseService.create(data);
  }

  @Patch(":id")
  @UsePipes(new ValidationPipe())
  update(@Body() dataUpdate: any, @Param("id") id: string) {
    return this.warehouseService.update(dataUpdate, id);
  }

  @Delete(":id")
  async deleteOne(@Param("id") id: string) {
    return this.warehouseService.delete(id);
  }

  @Delete()
  @ApiOperation({ summary: 'Delete multiple warehouses by IDs' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        ids: {
          type: 'array',
          items: {
            type: 'string'
          },
          example: ['60d21b4667d0d8992e610c85', '60d21b4667d0d8992e610c86'],
          description: 'Array of warehouse IDs to delete',
        },
      },
    },
  })
  async deleteMultiple(@Body() body: { ids: string[] }) {
    return this.warehouseService.delete(body.ids);
  }
}
