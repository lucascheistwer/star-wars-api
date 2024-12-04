import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "./users.service";
import { getModelToken } from "@nestjs/mongoose";
import { BadRequestException } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { CreateUserDto } from "./dto/user.dto";
import { User } from "./schemas/user.schema";

describe("UsersService", () => {
  let usersService: UsersService;

  const mockUserModel = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  const MockUserModel = jest.fn(() => mockUserModel);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: MockUserModel,
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should create a user with hashed password if email does not already exist", async () => {
      const createUserDto: CreateUserDto = {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "password123",
      };

      const mockSalt = "mockSalt";
      const mockHashedPassword = "mockHashedPassword";
      const mockSavedUser = { ...createUserDto, password: mockHashedPassword };

      jest.spyOn(usersService, "findOne").mockResolvedValueOnce(null);
      jest.spyOn(bcrypt, "genSalt").mockResolvedValueOnce(mockSalt);
      jest.spyOn(bcrypt, "hash").mockResolvedValueOnce(mockHashedPassword);

      mockUserModel.save.mockResolvedValueOnce(mockSavedUser);

      const result = await usersService.create(createUserDto);

      expect(usersService.findOne).toHaveBeenCalledWith(createUserDto.email);
      expect(bcrypt.genSalt).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalledWith(
        createUserDto.password,
        mockSalt
      );
      expect(MockUserModel).toHaveBeenCalledWith({
        ...createUserDto,
        password: mockHashedPassword,
      });
      expect(mockUserModel.save).toHaveBeenCalled();
      expect(result).toEqual(mockSavedUser);
    });

    it("should throw BadRequestException if email already exists", async () => {
      const createUserDto: CreateUserDto = {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "password123",
      };

      const mockExistingUser = { email: createUserDto.email };

      jest
        .spyOn(usersService, "findOne")
        .mockResolvedValueOnce(mockExistingUser as User);

      await expect(usersService.create(createUserDto)).rejects.toThrow(
        BadRequestException
      );

      expect(usersService.findOne).toHaveBeenCalledWith(createUserDto.email);
      expect(bcrypt.genSalt).not.toHaveBeenCalled();
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(mockUserModel.save).not.toHaveBeenCalled();
    });
  });
});
