import {
    IsNotEmpty,
    IsString,
    IsOptional,
    IsNumber,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class MaterialMstDto {
    @ApiProperty({ description: 'Material number', example: 'MAT001' })
    @IsNotEmpty()
    @IsString()
    material_no: string;

    @ApiProperty({ description: 'Material name', example: 'Sample Material' })
    @IsNotEmpty()
    @IsString()
    material_nm: string;

    @ApiProperty({ description: 'Material type', example: 'TYPE001' })
    @IsNotEmpty()
    @IsString()
    material_tp: string;

    @ApiProperty({ description: 'PK style', example: 1 })
    @IsOptional()
    @IsNumber()
    pk_style?: number;

    @ApiProperty({ description: 'New PK style', example: 1 })
    @IsOptional()
    @IsNumber()
    new_pk_style?: number;

    @ApiProperty({ description: 'Flag', example: 1 })
    @IsOptional()
    @IsNumber()
    flg?: number;

    @ApiProperty({ description: 'Comment', example: 'Sample comment' })
    @IsOptional()
    @IsString()
    comment?: string;
}
