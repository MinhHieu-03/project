import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { NextFunction, Response } from "express";
import { RoleService } from "src/module/role/role.service";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    private rolesService: RoleService,
  ) {}
  async use(req: any, res: Response, next: NextFunction) {
    if (req.headers?.authorization) {
      // const { metaData } = await this.rolesService.getAll();
      const token = req.headers?.authorization.split(" ")[1];
      try {
        const payload = await this.jwtService.verifyAsync(token, {
          secret: process.env.PRIVATE_KEY,
        });
        const { name, role } = payload;
        // const permissionsWithRole = metaData.find((item) => item.name === role);
        req["user"] = { name, role };
        req["permissions"] = [];
      } catch {
        throw new UnauthorizedException();
      }
      next();
    } else {
      throw new UnauthorizedException();
    }
  }
}
