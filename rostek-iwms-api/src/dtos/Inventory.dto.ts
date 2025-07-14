import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { INVENTORY_STATUS } from "src/shemas/inventory.schema";

class StoreItemDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    key: string;

    @ApiProperty()
    @IsNotEmpty()
    qty: number;
}

export class InventoryDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    sku: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    product: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    locationId: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    locationCode: string;

    @ApiProperty({ type: [StoreItemDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => StoreItemDto)
    store: StoreItemDto[];

    @ApiProperty({ enum: INVENTORY_STATUS, default: INVENTORY_STATUS.ACTIVE })
    @IsEnum(INVENTORY_STATUS)
    @IsOptional()
    status?: INVENTORY_STATUS;

}
