import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class SystemDto {
  @ApiProperty()
  product_line: string;

  @ApiProperty()
  product: string;

  @ApiProperty()
  sku: string;
}
