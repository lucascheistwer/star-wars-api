import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { ROLES_KEY } from "./roles.decorator";
import { UsersService } from "src/users/users.service";
import { Role } from "../enums/roles.enum";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private usersService: UsersService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles || roles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException("Authorization header missing");
    }

    const token = authHeader.split(" ")[1];
    try {
      const { email } = this.jwtService.verify(token);
      const user = await this.usersService.findByEmail(email);
      if (!roles.includes(user?.role) && user?.role !== Role.ADMIN) {
        throw new UnauthorizedException("Insufficient role permissions");
      }
      return true;
    } catch (error) {
      throw new UnauthorizedException("Invalid token");
    }
  }
}
