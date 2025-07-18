import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { Request } from "express";

@Injectable()
export class RolesGuard {
  constructor(private reflector: Reflector) { }

  //   public canActivate(context: ExecutionContext): boolean {
  //     const roles = this.reflector.getAllAndOverride<string[] | undefined>('roles', [
  //       context.getHandler(), // Method Roles
  //       context.getClass(), // Controller Roles
  //     ]);

  //     if (!roles) {
  //       return true;
  //     }

  //     let request: Request;
  //     if (context.getType<GqlContextType>() === 'graphql') {
  //       const ctx = GqlExecutionContext.create(context).getContext<{ req: Request }>();
  //       request = ctx.req;
  //     } else {
  //       request = context.switchToHttp().getRequest<Request>();
  //     }

  //     const { user:any } = request;
  //     if (!user) {
  //       return false;
  //     }

  //     return user.roles.some((role: string) => roles.includes(role));
  //   }
}
