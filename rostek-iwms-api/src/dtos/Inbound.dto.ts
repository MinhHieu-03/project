import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class InboundDto {

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    sku: string;

    @ApiProperty()
    @IsString()
    product_name: string;

    @ApiPropertyOptional({
        type: 'array',
        description: 'Store information with key and quantity',
        example: [{ key: 'store1', qty: 10 }]
    })
    @IsOptional()
    store?: Array<{
        key: string;
        qty: number;
    }>;
}

export class UpdateInboundDto {
    @ApiPropertyOptional({
        description: 'SKU of the product'
    })
    @IsOptional()
    @IsString()
    sku?: string;

    @ApiPropertyOptional({
        description: 'Product name'
    })
    @IsOptional()
    @IsString()
    product_name?: string;

    @ApiPropertyOptional({
        description: 'Status of the inbound',
        example: 'pending'
    })
    @IsOptional()
    @IsString()
    status?: string;

    @ApiPropertyOptional({
        description: 'Person in charge'
    })
    @IsOptional()
    @IsString()
    pic?: string;

    @ApiPropertyOptional({
        description: 'Origin location'
    })
    @IsOptional()
    @IsString()
    origin?: string;

    @ApiPropertyOptional({
        description: 'Destination location'
    })
    @IsOptional()
    @IsString()
    destination?: string;

    @ApiPropertyOptional({
        type: 'array',
        description: 'Store information with key and quantity',
        example: [{ key: 'store1', qty: 10 }]
    })
    @IsOptional()
    store?: Array<{
        key: string;
        qty: number;
    }>;
}
