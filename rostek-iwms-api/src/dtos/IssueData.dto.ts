import {
    IsOptional,
    IsString,
    IsNumber,
    IsDateString,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class IssueDataDto {
    @ApiProperty({ description: 'Section code', example: 'A001', required: false })
    @IsOptional()
    @IsString()
    section_c?: string;

    @ApiProperty({ description: 'Line code', example: 'L001', required: false })
    @IsOptional()
    @IsString()
    line_c?: string;

    @ApiProperty({ description: 'Issue order number', example: 'ISS001', required: false })
    @IsOptional()
    @IsString()
    issord_no?: string;

    @ApiProperty({ description: 'Issue order detail number', example: 'ISSD001', required: false })
    @IsOptional()
    @IsString()
    issord_dtl_no?: string;

    @ApiProperty({ description: 'Material number', example: 'MAT001', required: false })
    @IsOptional()
    @IsString()
    material_no?: string;

    @ApiProperty({ description: 'Issue quantity', example: 100, required: false })
    @IsOptional()
    @IsNumber()
    issue_qty?: number;

    @ApiProperty({ description: 'Issued quantity', example: 90, required: false })
    @IsOptional()
    @IsNumber()
    issued_qty?: number;

    @ApiProperty({ description: 'Plan date', example: '2025-06-24T00:00:00.000Z', required: false })
    @IsOptional()
    @IsDateString()
    plan_dt?: Date;

    @ApiProperty({ description: 'Data field 1', example: 'Data 1', required: false })
    @IsOptional()
    @IsString()
    data1?: string;

    @ApiProperty({ description: 'Data field 2', example: 'Data 2', required: false })
    @IsOptional()
    @IsString()
    data2?: string;

    @ApiProperty({ description: 'Data field 3', example: 'Data 3', required: false })
    @IsOptional()
    @IsString()
    data3?: string;

    @ApiProperty({ description: 'Data field 4', example: 'Data 4', required: false })
    @IsOptional()
    @IsString()
    data4?: string;

    @ApiProperty({ description: 'Data field 5', example: 'Data 5', required: false })
    @IsOptional()
    @IsString()
    data5?: string;

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
