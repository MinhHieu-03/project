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
import { FilterQuery } from "src/ultil/type";
import { RoleService } from "./role.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { RoleDto } from "src/dtos/Role.dto";
import { AuthGuard } from "src/common/guards/auth.guard";
import { PermissionGuard } from "src/common/guards/permission.guard";

@ApiTags("Role")
@ApiBearerAuth()
@Controller("role")
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Get("")
  getAll() {
    return this.roleService.getAll();
  }

  @Get(":id")
  getById(@Param("id") id: string) {
    return this.roleService.getById(id);
  }

  @Post("/list")
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  getRoleByFilter(@Body() data: FilterQuery) {
    return this.roleService.getRoleByFilter(data);
  }
  @Post("")
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  create(@Body() data: RoleDto) {
    return this.roleService.create(data);
  }

  @Patch(":id")
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  update(@Body() dataUpdate: RoleDto, @Param("id") id: string) {
    return this.roleService.update(dataUpdate, id);
  }

  @Delete(":id")
  @UseGuards(AuthGuard)
  async delete(@Param("id") id: string) {
    return this.roleService.delete(id);
  }
}
