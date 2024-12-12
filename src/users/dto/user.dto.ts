import { ApiProperty, OmitType } from "@nestjs/swagger";
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MinLength,
} from "class-validator";

export class CreateUserDto {
  @ApiProperty({
    description: "User first name",
    example: "John",
    required: false,
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    description: "User last name",
    example: "doe",
    required: false,
  })
  @IsString()
  lastName: string;

  @ApiProperty({
    description: "User email address",
    example: "john.doe@example.com",
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "User password",
    example: "password123",
  })
  @IsNotEmpty()
  @IsString()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minUppercase: 1,
    minSymbols: 1,
  })
  password: string;
}

export class UserDto extends OmitType(CreateUserDto, ["password"]) {}
