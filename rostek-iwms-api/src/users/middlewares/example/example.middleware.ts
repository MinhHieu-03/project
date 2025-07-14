import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class ExampleMiddleware implements NestMiddleware {
  use(req: any, res: Response, next: NextFunction) {
    req.user = "ok";
    next();
  }
}
