import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AuthMiddleware } from "./common/middleware/checkAuth.middleware";
import { AreaModule } from "./module/area/area.module";
import { AuthModule } from "./module/auth/auth.module";
import { CallBoxesModule } from "./module/call_boxes/call_boxes.module";
import { MissionHistoryModule } from "./module/mission_history/mission_history.module";
import { RoleModule } from "./module/role/role.module";
import { LocationModule } from "./module/location/location.module";
import { MismatchLocationModule } from "./module/mismatch_location/mismatch.module";
import { UsersModule } from "./users/users.module";
import { SectorsModule } from "./module/sectors/sectors.module";
import { SystemModule } from "./module/system/system.module";
import { ProductsModule } from "./module/products/products.module";
import { MenuModule } from "./module/menu/menu.module";
import { ScheduleModule } from "@nestjs/schedule";
import { RoleService } from "./module/role/role.service";
import { WarehouseModule } from "./module/warehouse/warehouse.module";
import { Role, Roleschema } from "./shemas/role.schema";
import { AreaConfigModule } from "./module/areaconfig/areaconfig.module";
import { StorageModelModule } from "./module/storage_model/storage_model.module";
import { MasterDataModule } from "./module/master_data/master_data.module";
import { MaterialMstModule } from "./module/material_mst/material_mst.module";
import { IssueDataModule } from "./module/issue_data/issue_data.module";
import { IssueTimeScheduleModule } from "./module/issue_time_schedule/issue_time_schedule.module";
import { MaterialRecvDataModule } from "./module/material_recv_data/material_recv_data.module";
import { InboundModule } from "./module/inbound/inbound.module";
import { OutboundModule } from "./module/outbound/outbound.module";
import { OrderModule } from "./module/order/order.module";
import { InventoryModule } from "./module/inventory/inventory.module";
import { OrderItemModule } from "./module/order_item/order_item.module";

// Helper function to create TypeORM module conditionally
const createTypeOrmModule = () => {
  console.log("process.env.DB_HOST...", process.env.DB_HOST);
  if (!process.env.DB_HOST) {
    console.log("DB_HOST is not set, skipping TypeORM module creation.");
    return [];
  }
  return [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        return {
          type: "mssql",
          host: config.get<string>("DB_HOST"),
          port: +config.get<number>("DB_PORT"),
          username: config.get<string>("DB_USER"),
          password: config.get<string>("DB_PASS"),
          database: config.get<string>("DB_NAME"),
          entities: [
            __dirname + "/**/*.entity{.ts,.js}",
            __dirname + "/**/shemas/*.entity{.ts,.js}",
          ],
          options: {
            encrypt: false,
            enableArithAbort: true,
          },
          autoLoadEntities: false,
        }
      },
    }),
  ];
};

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Role.name, schema: Roleschema }]),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        console.log("MONGODB_URL", config.get<string>("MONGODB_URL"));
        return {
          uri: `${config.get<string>("MONGODB_URL")}`,
        }
      },
      
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    ...createTypeOrmModule(),
    AuthModule,
    UsersModule,
    CallBoxesModule,
    MissionHistoryModule,
    AreaModule,
    RoleModule,
    LocationModule,
    MismatchLocationModule,
    SectorsModule,
    SystemModule,
    ProductsModule,
    MenuModule,
    WarehouseModule,
    AreaConfigModule,
    StorageModelModule,
    MasterDataModule,
    InventoryModule,
    ...(process.env.DB_HOST ? [
      MaterialMstModule,
      IssueDataModule,
      IssueTimeScheduleModule,
      MaterialRecvDataModule,
    ] : []),

    InboundModule,
    OutboundModule,
    OrderModule,
    OrderItemModule,
    JwtModule.register({
      secret: process.env.PRIVATE_KEY,
      signOptions: { expiresIn: 3600 },
    }),
    ScheduleModule.forRoot(),
  ],
  controllers: [],
  providers: [RoleService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: "products", method: RequestMethod.GET },
        { path: "sectors", method: RequestMethod.GET },
        { path: "system", method: RequestMethod.GET },
        { path: "menus", method: RequestMethod.GET },
        { path: "auth/signup", method: RequestMethod.POST },
        { path: "auth/login", method: RequestMethod.ALL },
        // Explicitly allow auth/list to go through middleware
        // "mission_history/download",
      )
      .forRoutes("*");
  }
}
