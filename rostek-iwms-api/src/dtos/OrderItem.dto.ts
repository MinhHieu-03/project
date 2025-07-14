import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class OrderItemDto {
    @ApiProperty({ description: 'SKU of the product' })
    @IsNotEmpty()
    @IsString()
    sku: string;

    @ApiProperty({ description: 'Unit of measurement' })
    @IsOptional()
    @IsString()
    unit: string;

    @ApiProperty({ description: 'Quantity of the item' })
    @IsNotEmpty()
    @IsNumber()
    qty: number;

    @ApiProperty({ description: 'Product name' })
    @IsOptional()
    @IsString()
    product_name: string;

    @ApiProperty({ description: 'Price of the item' })
    @IsOptional()
    @IsNumber()
    price: number;

    @ApiProperty({ description: 'Order ID reference' })
    @IsNotEmpty()
    @IsString()
    orderId: string;
}
