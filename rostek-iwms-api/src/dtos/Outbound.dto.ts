import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Schema as MongooseSchema } from "mongoose";

export class OutboundDto {
  //   @ApiProperty()
  //   order_id: MongooseSchema.Types.ObjectId;

  //   @ApiProperty()
  //   @IsNotEmpty()
  //   @IsString()
  //   bin_code: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  sku: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  qty: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  unit: string;

  //   @ApiProperty()
  //   @IsNotEmpty()
  //   @IsString()
  //   location: string;

  //   @ApiProperty()
  //   @IsNotEmpty()
  //   @IsString()
  //   status: string;

  //   @ApiPropertyOptional()
  //   @IsOptional()
  //   mission?: MongooseSchema.Types.ObjectId;
  //   @ApiProperty()
  //   @IsNotEmpty()
  //   inventory: MongooseSchema.Types.ObjectId;
}
