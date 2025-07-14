import { Controller, Get } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { SECTORS } from "src/helpers/const";
import { convertDataResponse } from "src/ultil";

@ApiTags("Loại hàng")
@ApiBearerAuth()
@Controller("sectors")
export class SectorsController {
  @Get("")
  getAllSectors() {
    return convertDataResponse("Ok", SECTORS);
  }
}
