import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  ValidationPipe,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "src/users/dto/user.dto";
import { UsersService } from "src/users/users.service";
import { LoginDto } from "./dto/login.dto";

@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post("login")
  signIn(@Body(new ValidationPipe()) signInDto: LoginDto) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post("register")
  async create(@Body(new ValidationPipe()) body: CreateUserDto) {
    const createdUser = await this.usersService.create(body);
    return {
      message: "User created successfully",
      data: createdUser,
    };
  }
}
