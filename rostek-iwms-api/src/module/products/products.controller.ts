import { Controller, Get } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { PRODUCTS } from "src/helpers/const";
import { convertDataResponse } from "src/ultil";

@ApiTags("Sản phẩm")
@ApiBearerAuth()
@Controller("products")
export class ProductsController {
  @Get("")
  getAllProducts() {
    return convertDataResponse("Ok", PRODUCTS);
  }
}
