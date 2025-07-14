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
import { AreaDto } from "src/dtos/Area.dto";
import { FilterQuery } from "src/ultil/type";
import { AreaService } from "./area.service";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("Khu vực")
@ApiBearerAuth()
@Controller("area")
export class AreaController {
  constructor(private areaService: AreaService) { }

  @Get("")
  getAll(@Query() params: any) {
    return this.areaService.getAll(params);
  }

  @Get(":id")
  getById(@Param("id") id: string) {
    return this.areaService.getById(id);
  }

  @Post("/list")
  @UsePipes(ValidationPipe)
  @ApiOperation({ summary: 'Get areas by filter criteria' })
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
          example: { location_code: 'AREA-A' },
          description: 'Filter criteria',
        },
      },
    },
  })
  getAreaByFilter(@Body() data: FilterQuery) {
    return this.areaService.getUserByFilter(data);
  }
  @Post("")
  @UsePipes(new ValidationPipe())
  create(@Body() data: AreaDto) {
    return this.areaService.create(data);
  }

  @Patch(":id")
  @UsePipes(new ValidationPipe())
  update(@Body() dataUpdate: any, @Param("id") id: string) {
    return this.areaService.update(dataUpdate, id);
  }

  @Delete(":id")
  async deleteOne(@Param("id") id: string) {
    return this.areaService.delete(id);
  }
  
  @Delete()
  @ApiOperation({ summary: 'Delete multiple areas by IDs' })
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
          description: 'Array of area IDs to delete',
        },
      },
    },
  })
  async deleteMultiple(@Body() body: { ids: string[] }) {
    return this.areaService.delete(body.ids);
  }
}
