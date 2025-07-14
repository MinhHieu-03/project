import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { UserDto } from "src/dtos/CreateUser.dto";
import { User, UserSchema } from "src/shemas/user.schema";
import { Model } from "mongoose";
import { UsersModule } from "src/users/users.module";
import { Account } from "src/shemas/account.schema";

@Injectable()
export class UsersService {
  constructor(@InjectModel(Account.name) private userModel: Model<Account>) {}

  getAllUsers() {
    return this.userModel.find();
  }

  createUser(user: UserDto) {
    const newUser = new this.userModel(user);
    return newUser.save();
  }

  getUserById(id: string) {
    return this.userModel.findById(id);
  }

  async updateUser(id: string, data: Partial<UserDto>) {
    const updatedUser = await this.userModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!updatedUser) throw new NotFoundException('Người dùng không tồn tại');
    return updatedUser;
  }

  async deleteUser(id: string) {
    const deletedUser = await this.userModel.findByIdAndDelete(id);
    if (!deletedUser) throw new NotFoundException('Người dùng không tồn tại');
    return deletedUser;
  }
}

