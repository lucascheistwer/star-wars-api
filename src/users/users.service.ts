import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "./schemas/user";
import { Model } from "mongoose";
import { CreateUserDto } from "./dto/user.dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.findOne(createUserDto.email);
    if (existingUser) {
      throw new BadRequestException("User already exists");
    }
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(email: string): Promise<User> {
    return this.userModel.findOne({ email }).exec();
  }
}
