import { ApiProperty, OmitType, PickType } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class UserDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    enum: ["Admin", "Manager", "Operator"],
  })
  @IsNotEmpty()
  role: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;
}

export class CreateUserDto extends UserDto {}

export class UpdateUserPasswordDto extends PickType(UserDto, [
  "password",
] as const) {}

export class UpdateUserDto extends OmitType(UserDto, ["password"] as const) {}

export class LoginDto extends OmitType(UserDto, ["role"] as const) {}