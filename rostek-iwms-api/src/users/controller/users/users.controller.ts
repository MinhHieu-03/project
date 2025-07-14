import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  UsePipes,
  ValidationPipe,
  Param,
} from "@nestjs/common";
import { UserDto } from "src/dtos/CreateUser.dto";
import { UsersService } from "src/users/services/users/users.service";
import { ParseMongoIdPipe } from "src/users/pipes/validate-create-user/parse-mongo-id.pipe";
import { UpdateUserDto } from "src/dtos/CreateUser.dto";

@Controller("users")
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get()
  getUser() {
    return this.userService.getAllUsers();
  }

  @Post()
  @UsePipes(new ValidationPipe())
  createUser(@Body() userData: UserDto) {
    return this.userService.createUser(userData);
  }

  @Get(":id")
  getUserById(@Param("id") id: string) {
    return this.userService.getUserById(id);
  }

  @Patch(":id")
  async updateUser(
    @Param("id", ParseMongoIdPipe) id: string,
    @Body() body: UpdateUserDto,
  ) {
    const metaData = await this.userService.updateUser(id, body);
    return { message: "Cập nhật người dùng thành công ✅", metaData };
  }

  @Delete(":id")
  async deleteUser(@Param("id", ParseMongoIdPipe) id: string) {
    const metaData = await this.userService.deleteUser(id);
    return { message: "Xoá người dùng thành công 🗑️", metaData };
  }
}
