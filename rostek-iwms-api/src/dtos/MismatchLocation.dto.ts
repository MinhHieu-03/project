import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";
import { STATUS_LOCATION } from "src/shemas/location.schema";
import { RCS_STATUS_LOCATION } from "src/shemas/mismatch_location.schema";

export class MismatchLocationDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ enum: Object.keys(STATUS_LOCATION) })
  @IsNotEmpty()
  status: string;

  @ApiProperty({ enum: Object.keys(RCS_STATUS_LOCATION) })
  @IsNotEmpty()
  rcs_status: string;
}
