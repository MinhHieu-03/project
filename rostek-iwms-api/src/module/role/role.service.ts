import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Role } from "src/shemas/role.schema";
import { FilterDataResponse, convertDataResponse } from "src/ultil";
import { FilterQuery } from "src/ultil/type";
import * as dataMenu from "../../menu.json";
import { RoleDto } from "src/dtos/Role.dto";

@Injectable()
export class RoleService {
  constructor(@InjectModel(Role.name) private modelRole: Model<Role>) {}

  async getAll() {
    const data = await this.modelRole.find();
    return convertDataResponse("OK", data);
  }

  async getRoleByFilter(body: FilterQuery) {
    return await FilterDataResponse(body, this.modelRole);
  }

  async getById(id: any) {
    const data = await this.modelRole.findById(id);
    if (!data) throw new HttpException("Id invalid", HttpStatus.NOT_FOUND);
    return convertDataResponse("Ok", data);
  }
  async create(data: RoleDto) {
    console.log("dataMenu", dataMenu);
    const permission = dataMenu.reduce((pre, cur) => {
      return { ...pre, [cur.key]: "" };
    }, {});
    const newRole = await this.modelRole.create({ ...data, permission });
    return convertDataResponse("Create Success", newRole);
  }

  async update(data: RoleDto, id: string) {
    const dataUpdate = await this.modelRole.findByIdAndUpdate(id, data, {
      new: true,
    });
    return convertDataResponse("Update Success", dataUpdate);
  }

  async delete(id: string) {
    const deleteSuccess = await this.modelRole.findByIdAndDelete(id);
    if (!deleteSuccess)
      throw new HttpException("Id invalid", HttpStatus.NOT_FOUND);
    return {
      msg: "Delete Menu Success",
    };
  }
}
