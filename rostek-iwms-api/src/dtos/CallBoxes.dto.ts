import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsEmpty, IsOptional } from "class-validator";
import { SECTORS } from "src/helpers/const";
import { STATUS_STOCK, STATUS_ACTION } from "src/shemas/call_boxes.schema";

export class CallBoxesDto {
  @ApiProperty()
  @IsNotEmpty()
  call_boxes_code: string;

  @ApiProperty()
  @IsNotEmpty()
  deviceId: string;

  @ApiProperty()
  @IsNotEmpty()
  rcs_code: string;

  @ApiProperty()
  @IsNotEmpty()
  location: string;

  @ApiProperty({
    enum: SECTORS,
  })
  @IsNotEmpty()
  sectors: string;

  @ApiProperty()
  @IsNotEmpty()
  gateway_id: string;

  @ApiProperty()
  @IsNotEmpty()
  plc_id: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(Object.values(STATUS_STOCK))
  status_connect?: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(Object.values(STATUS_ACTION))
  status_action?: string;
}
