import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { UsersController } from "./controller/users/users.controller";
import { UsersService } from "./services/users/users.service";
import { ExampleMiddleware } from "./middlewares/example/example.middleware";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "src/shemas/user.schema";
import { Account, AccountSchema } from "src/shemas/account.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Account.name,
        schema: AccountSchema,
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})

export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ExampleMiddleware).forRoutes({
      path: "users",
      method: RequestMethod.ALL,
    });
  }
}
