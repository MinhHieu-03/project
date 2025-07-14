import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import * as fs from "fs";
import { readFile } from "fs/promises";
import { join } from "path";
// import { SYSTEM } from 'src/helpers/const';

@ApiTags("Hệ thống")
@ApiBearerAuth()
@Controller("system")
export class SystemController {
  @Get("")
  async getAll() {
    const file = (
      await readFile(join(process.cwd(), "src/system.json"))
    ).toString("utf8");
    return JSON.parse(file);
  }

  @Post("")
  async updateSystem(@Body() data: any) {
    fs.writeFileSync(
      join(process.cwd(), "src/system.json"),
      JSON.stringify(data),
    );
    return { msg: "Update Success" };
  }
  // @Get('')
  // getAll() {
  //     return this.systemService.getAll()
  // }

  // @Get(':id')
  // getById(@Param('id') id: string) {
  //     return this.systemService.getById(id)
  // }

  // @Post('/list')
  // @UsePipes(ValidationPipe)
  // getUserByFilter(@Body() data: FilterQuery) {
  //     return this.systemService.getUserByFilter(data)
  // }
  // @Post('')
  // @UsePipes(new ValidationPipe())
  // create(@Body() data: SystemDto) {
  //     return this.systemService.create(data);
  // }

  // @Patch(':id')
  // @UsePipes(new ValidationPipe())
  // update(@Body() dataUpdate: any, @Param('id') id: string) {
  //     return this.systemService.update(dataUpdate, id);
  // }

  // @Delete(":id")
  // async delete(@Param('id') id: string) {
  //     return this.systemService.delete(id);
  // }
}
