import {
    IsOptional,
    IsString,
    IsDateString,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class IssueTimeScheduleDto {
    @ApiProperty({ description: 'Section code', example: 'A001', required: false })
    @IsOptional()
    @IsString()
    section_c?: string;

    @ApiProperty({ description: 'Factory code', example: 'FACT001', required: false })
    @IsOptional()
    @IsString()
    fact_c?: string;

    @ApiProperty({ description: 'Line code', example: 'LINE001', required: false })
    @IsOptional()
    @IsString()
    line_c?: string;

    @ApiProperty({ description: 'Product number', example: 'PROD001', required: false })
    @IsOptional()
    @IsString()
    prod_no?: string;

    @ApiProperty({ description: 'Customer description code 1', example: 'CUS1', required: false })
    @IsOptional()
    @IsString()
    cusdesch_cd1?: string;

    @ApiProperty({ description: 'Customer description code 2', example: 'C2', required: false })
    @IsOptional()
    @IsString()
    cusdesch_cd2?: string;

    @ApiProperty({ description: 'Internal description code', example: 'I1', required: false })
    @IsOptional()
    @IsString()
    intdesch_cd?: string;

    @ApiProperty({ description: 'Issue order number', example: 'ISS001', required: false })
    @IsOptional()
    @IsString()
    issue_ord_no?: string;

    @ApiProperty({ description: 'Plan issue date', example: '2025-06-24T00:00:00.000Z', required: false })
    @IsOptional()
    @IsDateString()
    plan_issue_dt?: Date;

    @ApiProperty({ description: 'A required time', example: '2025-06-24T08:00:00.000Z', required: false })
    @IsOptional()
    @IsDateString()
    A_reqd_time?: Date;

    @ApiProperty({ description: 'Time issue', example: '2025-06-24T08:30:00.000Z', required: false })
    @IsOptional()
    @IsDateString()
    time_issue?: Date;

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
