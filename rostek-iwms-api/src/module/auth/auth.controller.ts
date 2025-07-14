import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
  Get,
  Param,
  UseGuards,
  Delete,
  Patch,
} from "@nestjs/common";
import {
  CreateUserDto,
  UpdateUserDto,
  UserDto,
  LoginDto,
  UpdateUserPasswordDto,
} from "src/dtos/CreateUser.dto";
import { AuthService } from "./auth.service";
import { FilterQuery } from "src/ultil/type";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "src/common/guards/auth.guard";

@ApiTags("Đăng nhập / Đăng ký")
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("login")
  @UsePipes(new ValidationPipe())
  login(@Body() userData: LoginDto) {
    return this.authService.login(userData);
  }

  @Get("")
  getAll() {
    return this.authService.getAll();
  }

  @Post("/list")
  @ApiBearerAuth()
  @UsePipes(ValidationPipe)
  getUserByFilter(@Body() data: FilterQuery) {
    console.log("data", data);
    return this.authService.getUserByFilter(data);
  }

  @Post("/signup")
  // @ApiBearerAuth()
  // @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  createUser(@Body() userData: CreateUserDto) {
    return this.authService.createUser(userData);
  }

  @Patch("/account/:id")
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  updateUser(@Body() userData: UpdateUserDto, @Param("id") id: string) {
    return this.authService.updateUser(userData, id);
  }
  @Patch("/account/change_password/:id")
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  updateUserPassword(
    @Body() userData: UpdateUserPasswordDto,
    @Param("id") id: string,
  ) {
    return this.authService.updateUserPassword(userData, id);
  }

  @Get(":id")
  getById(@Param("id") id: string) {
    return this.authService.getById(id);
  }

  @Delete(":id")
  async delete(@Param("id") id: string) {
    return this.authService.delete(id);
  }


}
