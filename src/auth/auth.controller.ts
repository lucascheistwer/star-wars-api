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
import { mapCreateUserResponse } from "./mappers/user.mapper";
import { ApiBody, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { AUTH_EXAMPLES } from "./auth.examples";

@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService
  ) {}

  @ApiOperation({ summary: "User login" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Successful login",
    schema: { example: AUTH_EXAMPLES.tokenResponse },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Invalid credentials",
  })
  @ApiBody({
    description: "Login payload",
    type: LoginDto,
    examples: AUTH_EXAMPLES.loginBody,
  })
  @HttpCode(HttpStatus.OK)
  @Post("login")
  signIn(@Body(new ValidationPipe()) signInDto: LoginDto) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @ApiOperation({ summary: "Register user" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "User created",
    schema: { example: AUTH_EXAMPLES.createUserResponse },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "User already exists",
  })
  @ApiBody({
    description: "Register user payload",
    type: CreateUserDto,
    examples: AUTH_EXAMPLES.registerUserBody,
  })
  @HttpCode(HttpStatus.CREATED)
  @Post("register")
  async create(@Body(new ValidationPipe()) body: CreateUserDto) {
    const createdUser = await this.usersService.create(body);
    return mapCreateUserResponse(createdUser);
  }
}
