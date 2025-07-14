import {
  IsString,
  IsOptional,
  IsBoolean,
  IsObject,
  IsArray,
  IsMongoId,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Types } from "mongoose";

export class AreaConfigDto {
  @ApiProperty({ description: "Name of the area configuration" })
  @IsString()
  name: string;

  @ApiProperty({
    description: "Description of the area configuration",
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  // @ApiProperty({ description: "List of production types", type: [String] })
  // @IsArray()
  // @IsString({ each: true })
  // productions: string[];

  @ApiProperty({
    description: "Settings for the area configuration",
    required: false,
  })
  @IsObject()
  @IsOptional()
  settings?: Record<string, any>;

  @ApiProperty({
    description: "Warehouse reference ID",
    required: false,
  })
  @IsMongoId()
  @IsOptional()
  warehouse?: Types.ObjectId;

  @ApiProperty({
    description: "Whether the area configuration is active",
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
