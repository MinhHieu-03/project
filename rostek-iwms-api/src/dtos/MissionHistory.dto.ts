import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty } from "class-validator";
import { SECTORS } from "src/helpers/const";
import { STATUS_MISSION } from "src/shemas/mission_history.schema";

export class MissionHistoryDto {
  @ApiProperty()
  @IsNotEmpty()
  mission_code: string;

  @ApiProperty()
  @IsNotEmpty()
  robot_code: string;

  @ApiProperty()
  @IsNotEmpty()
  pickup_location: string;

  @ApiProperty()
  @IsNotEmpty()
  return_location: string;

  @ApiProperty()
  @IsNotEmpty()
  @ApiProperty({
    enum: SECTORS,
  })
  sector: string;

  @ApiProperty()
  @IsNotEmpty()
  object_call: string;

  @ApiProperty({
    enum: Object.values(STATUS_MISSION),
  })
  @IsEnum(Object.values(STATUS_MISSION))
  @IsNotEmpty()
  current_state: string;
}
