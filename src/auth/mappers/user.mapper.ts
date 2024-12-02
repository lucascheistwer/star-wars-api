import { UserDto } from "src/users/dto/user.dto";
import { User } from "src/users/schemas/user";

export const mapCreateUserResponse = (user: User): UserDto => ({
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
});
