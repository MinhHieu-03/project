import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class WarehouseDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  description: string;
}
