import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Role, Roleschema } from "src/shemas/role.schema";
import { RoleController } from "./role.controller";
import { RoleService } from "./role.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Role.name,
        schema: Roleschema,
      },
    ]),
  ],
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule {}
