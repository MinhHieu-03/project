import { IsString, IsEnum, IsArray, ValidateNested, IsNumber, IsNotEmpty, IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class OrderDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    customer: string;

    @IsDate()
    @Type(() => Date)
    @IsOptional()
    order_date: Date;

    @IsString()
    @IsOptional()
    description: string;

    @IsEnum(['pending', 'processing', 'shipped', 'delivered', 'canceled'])
    status: string;
}
