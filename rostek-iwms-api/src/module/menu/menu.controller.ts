import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { readFile, writeFile } from "fs/promises";
import { join } from "path";
import { AuthGuard } from "src/common/guards/auth.guard";
import * as fs from "fs";

@ApiTags("Danh sách menu")
@ApiBearerAuth()
@Controller("menus")
export class MenuController {
  @Get("")
  async getAll() {
    const file = (
      await readFile(join(process.cwd(), "src/menu.json"))
    ).toString("utf8");
    return JSON.parse(file);
  }

  @Post("")
  @UseGuards(AuthGuard)
  async updateSystem(@Body() data: any) {
    fs.writeFileSync(
      join(process.cwd(), "src/menu.json"),
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
