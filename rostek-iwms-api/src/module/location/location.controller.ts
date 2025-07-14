import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
  Req,
} from "@nestjs/common";
import { LocationDto } from "src/dtos/Location.dto";
import { FilterQuery, BundleCreate } from "src/ultil/type";
import { LocationService } from "./location.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiTags("Vị trí")
@ApiBearerAuth()
@Controller("location")
export class LocationController {
  constructor(private locationService: LocationService) { }

  @Get("")
  getAll() {
    return this.locationService.getAll();
  }

  @Get(":id")
  getById(@Param("id") id: string) {
    return this.locationService.getById(id);
  }

  @Post("/list")
  @UsePipes(ValidationPipe)
  getUserByFilter(@Body() data: FilterQuery) {
    return this.locationService.getUserByFilter(data);
  }
  @Patch("/bundle/create")
  @UsePipes(ValidationPipe)
  bundleCreate(@Body() data: BundleCreate) {
    return this.locationService.bundleCreate(data);
  }

  @Get("/area/:area")
  getLocationByArea(@Param("area") area: string) {
    return this.locationService.getLocationByArea(area);
  }

  @Post("")
  @UsePipes(new ValidationPipe())
  createAndUpdate(@Body() data: LocationDto, @Req() request: any) {
    const { name } = request?.user;
    return this.locationService.createAndUpdate(data, name);
  }

  @Post("/dal")
  @UsePipes(new ValidationPipe())
  createAndUpdateDal(@Body() data: LocationDto, @Req() request: any) {
    const { name } = request?.user;
    return this.locationService.createAndUpdateDal(data, name);
  }

  @Post("/del")
  deleteLocationBatch(@Body() data: any) {
    return this.locationService.deleteLocation(data);
  }

  @Patch(":id")
  @UsePipes(new ValidationPipe())
  update(@Body() dataUpdate: any, @Param("id") id: string) {
    return this.locationService.update(dataUpdate, id);
  }

  @Delete(":id")
  async deleteLocation(@Param("id") id: string) {
    return this.locationService.delete(id);
  }
}
