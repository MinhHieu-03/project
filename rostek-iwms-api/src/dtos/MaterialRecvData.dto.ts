import {
    IsOptional,
    IsString,
    IsNumber,
    IsDateString,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class MaterialRecvDataDto {
    @ApiProperty({ description: 'Section code', example: 'A001', required: false })
    @IsOptional()
    @IsString()
    section_c?: string;

    @ApiProperty({ description: 'Supplier code', example: 'SUPP001', required: false })
    @IsOptional()
    @IsString()
    supplier_c?: string;

    @ApiProperty({ description: 'Invoice number', example: 'INV001', required: false })
    @IsOptional()
    @IsString()
    invoice_no?: string;

    @ApiProperty({ description: 'Pallet ID', example: 'PAL001', required: false })
    @IsOptional()
    @IsString()
    pallet_id?: string;

    @ApiProperty({ description: 'Material number', example: 'MAT001', required: false })
    @IsOptional()
    @IsString()
    material_no?: string;

    @ApiProperty({ description: 'Received quantity', example: 100.50, required: false })
    @IsOptional()
    @IsNumber()
    recv_qty?: number;

    @ApiProperty({ description: 'Scanned quantity', example: 95.25, required: false })
    @IsOptional()
    @IsNumber()
    Scanned_qty?: number;

    @ApiProperty({ description: 'Flag', example: '1', required: false })
    @IsOptional()
    @IsString()
    flg?: string;

    @ApiProperty({ description: 'User ID', example: 'USER001', required: false })
    @IsOptional()
    @IsString()
    userid?: string;

    @ApiProperty({ description: 'Entry date', example: '2025-06-24T00:00:00.000Z', required: false })
    @IsOptional()
    @IsDateString()
    ent_dt?: Date;

    @ApiProperty({ description: 'Update date', example: '2025-06-24T00:00:00.000Z', required: false })
    @IsOptional()
    @IsDateString()
    upd_dt?: Date;
}
