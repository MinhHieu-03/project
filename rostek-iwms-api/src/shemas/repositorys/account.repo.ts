import { InjectModel } from "@nestjs/mongoose";
import { AccountSchema, Account } from "../account.schema";
import { Model } from "mongoose";

export class AccountRepo {
  constructor(@InjectModel(Account.name) private userModel: Model<Account>) {}

  async findByName(name: string) {
    return await this.userModel.findOne({ name });
  }
}
