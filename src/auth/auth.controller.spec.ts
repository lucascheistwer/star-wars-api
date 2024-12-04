import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UsersService } from "src/users/users.service";
import { CreateUserDto } from "src/users/dto/user.dto";
import { LoginDto } from "./dto/login.dto";
import { mapCreateUserResponse } from "./mappers/user.mapper";
import {
  BadRequestException,
  UnauthorizedException,
  ValidationPipe,
} from "@nestjs/common";

jest.mock("./mappers/user.mapper");

describe("AuthController", () => {
  let authController: AuthController;
  let authService: AuthService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signIn: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("signIn", () => {
    it("should call AuthService.signIn with correct arguments and return its result", async () => {
      const loginDto: LoginDto = {
        email: "john.doe@example.com",
        password: "password",
      };
      const mockToken = "mockToken";

      jest
        .spyOn(authService, "signIn")
        .mockResolvedValueOnce({ accessToken: mockToken });

      const result = await authController.signIn(loginDto);

      expect(authService.signIn).toHaveBeenCalledWith(
        loginDto.email,
        loginDto.password
      );
      expect(result).toStrictEqual({ accessToken: mockToken });
    });

    it("should throw unauthorized exception if AuthService.signIn throws an error", async () => {
      const loginDto: LoginDto = {
        email: "john.doe@example.com",
        password: "wrongPassword",
      };
      const exception = new UnauthorizedException("Invalid email or password");
      jest.spyOn(authService, "signIn").mockRejectedValueOnce(exception);
      const result = authController.signIn(loginDto);
      expect(result).rejects.toThrow(exception);
    });

    it("should throw an exception if schema is invalid", async () => {
      const validationPipe = new ValidationPipe();
      const invalidDto = { email: "invalid-email", password: "password" };

      await expect(
        validationPipe.transform(invalidDto, {
          type: "body",
          metatype: LoginDto,
        })
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe("register", () => {
    it("should call UsersService.create and mapCreateUserResponse with correct arguments", async () => {
      const createUserDto: CreateUserDto = {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "password",
      };
      const mockUser = { _id: "123", ...createUserDto };
      const mockResponse = {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
      };

      jest.spyOn(usersService, "create").mockResolvedValueOnce(mockUser);
      (mapCreateUserResponse as jest.Mock).mockReturnValueOnce(mockResponse);

      const result = await authController.create(createUserDto);

      expect(usersService.create).toHaveBeenCalledWith(createUserDto);
      expect(mapCreateUserResponse).toHaveBeenCalledWith(mockUser);
      expect(result).toBe(mockResponse);
    });

    it("should throw an exception if email is invalid", async () => {
      const validationPipe = new ValidationPipe();
      const invalidDto = { email: "invalid-email", password: "password" };

      await expect(
        validationPipe.transform(invalidDto, {
          type: "body",
          metatype: CreateUserDto,
        })
      ).rejects.toThrow(BadRequestException);
    });

    it("should throw an exception if password is invalid", async () => {
      const validationPipe = new ValidationPipe();
      const invalidDto = { email: "john.doe@example.com", password: "1234" };

      await expect(
        validationPipe.transform(invalidDto, {
          type: "body",
          metatype: CreateUserDto,
        })
      ).rejects.toThrow(BadRequestException);
    });

    it("should throw an exception if UsersService.create throws an error", async () => {
      const createUserDto: CreateUserDto = {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "password",
      };
      const exception = new BadRequestException("User already exists");
      jest.spyOn(usersService, "create").mockRejectedValueOnce(exception);
      const result = authController.create(createUserDto);
      expect(result).rejects.toThrow(exception);
    });
  });
});
