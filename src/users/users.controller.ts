import { Body, Controller, Get, Post } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/user.dto";

@Controller("users")
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  async create(@Body() body: CreateUserDto) {
    const createdUser = await this.usersService.create(body);
    return {
      message: "User created successfully",
      data: createdUser,
    };
  }

  @Get()
  async findAll() {
    return await this.usersService.findAll();
  }
}
