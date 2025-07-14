import { ApiProperty } from "@nestjs/swagger";
import {
  IsEnum,
  IsNotEmpty,
  Max,
  Min,
  IsString,
  IsOptional,
  IsMongoId,
  IsNumber,
} from "class-validator";
import { AREA, STATUS_AREA } from "src/shemas/area.schema";

export class AreaDto {
  // @ApiProperty({
  //   description: "Type of warehouse area",
  //   enum: Object.values(AREA),
  // })
  // @IsNotEmpty()
  // @IsEnum(AREA)
  // warehouse_type: string;

  @ApiProperty({ description: "Location code" })
  @IsNotEmpty()
  @IsString()
  location_code: string;

  @ApiProperty({ description: "Row number" })
  @IsNumber()
  @Max(1000)
  @Min(1)
  @IsNotEmpty()
  row: number;

  @ApiProperty({ description: "Column number" })
  @IsNumber()
  @Max(1000)
  @Min(1)
  @IsNotEmpty()
  column: number;

  @ApiProperty({ description: "Object update", required: false })
  @IsString()
  @IsOptional()
  object_update?: string;

  @ApiProperty({
    description: "Position",
    enum: ["top-left", "top-right", "bottom-left", "bottom-right"],
    required: false,
  })
  @IsString()
  @IsOptional()
  position?: string;

  @ApiProperty({
    description: "Direction",
    enum: ["horizontal", "vertical"],
    required: false,
  })
  @IsString()
  @IsOptional()
  direction?: string;

  @ApiProperty({ description: "Status", enum: Object.values(STATUS_AREA) })
  @IsEnum(STATUS_AREA)
  @IsNotEmpty()
  status: string;

  @ApiProperty({ description: "Warehouse ID" })
  @IsNotEmpty()
  @IsMongoId()
  warehouse: string;

  @ApiProperty({ description: "Area Configuration ID", required: false })
  @IsMongoId()
  @IsOptional()
  area_config?: string;

  @ApiProperty({ description: "RCS", required: false })
  @IsString()
  @IsOptional()
  rcs?: string;
}
