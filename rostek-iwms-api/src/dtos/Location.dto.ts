import { ApiProperty } from "@nestjs/swagger";
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsArray,
} from "class-validator";
import { STATUS_LOCATION } from "src/shemas/location.schema";

export class LocationDto {
  @ApiProperty({ description: "Unique location code" })
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty({
    description: "Array of SKUs associated with the location",
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skus?: string[];

  @ApiProperty({ description: "Area ID reference" })
  @IsString()
  @IsNotEmpty()
  areaId: string;

  @ApiProperty({
    description: "Area code for quick reference",
    required: false,
  })
  @IsOptional()
  @IsString()
  areaCode?: string;

  @ApiProperty({ description: "Area configuration reference", required: false })
  @IsOptional()
  @IsString()
  area_config?: string;

  @ApiProperty({ description: "Inventory reference", required: false })
  @IsOptional()
  @IsString()
  inventory?: string;

  @ApiProperty({
    enum: Object.values(STATUS_LOCATION),
    description: "Location status",
    default: STATUS_LOCATION.AVAILABLE,
  })
  @IsEnum(STATUS_LOCATION)
  status: string;
}
