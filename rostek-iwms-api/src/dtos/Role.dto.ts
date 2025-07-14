import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class RoleDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  describe: string;
}
