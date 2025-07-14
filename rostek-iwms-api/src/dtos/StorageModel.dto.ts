import { IsBoolean, IsNotEmpty, IsObject, IsArray, IsOptional, IsString } from "class-validator";
import { Type } from 'class-transformer';

import { ApiProperty } from "@nestjs/swagger";

export class StorageModelDto {
    @ApiProperty({
        description: "Flow configuration with edges, nodes, and storage units",
        required: false,
        example: {
            edges: [
                {
                    id: "edge1",
                    source: "node1",
                    target: "node2"
                }
            ],
            nodes: [
                {
                    id: "node1",
                    type: "input",
                    position: { x: 0, y: 0 }
                }
            ],
            storage_unit: [
                {
                    id: "unit1",
                    name: "Storage Unit 1",
                    capacity: 100
                }
            ]
        }
    })
    @IsObject()
    @IsOptional()
    edges: Record<string, any>[];
    @IsObject()
    @IsOptional()
    nodes: Record<string, any>[];
    @IsObject()
    @IsOptional()
    storage_unit: Record<string, any>[];

}