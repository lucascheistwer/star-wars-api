import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "src/users/users.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { UnauthorizedException } from "@nestjs/common";
import { Role } from "src/common/enums/roles.enum";

describe("AuthService", () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("signIn", () => {
    it("should return an access token if email and password are valid", async () => {
      const mockUser = {
        _id: "123",
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: await bcrypt.hash("password", 10),
        role: Role.REGULAR,
      };
      const mockAccessToken = "mockAccessToken";

      jest.spyOn(usersService, "findByEmail").mockResolvedValueOnce(mockUser);
      jest.spyOn(bcrypt, "compare").mockResolvedValueOnce(true);
      jest.spyOn(jwtService, "sign").mockReturnValueOnce(mockAccessToken);

      const result = await authService.signIn(
        "john.doe@example.com",
        "password"
      );

      expect(usersService.findByEmail).toHaveBeenCalledWith(
        "john.doe@example.com"
      );
      expect(bcrypt.compare).toHaveBeenCalledWith(
        "password",
        mockUser.password
      );
      expect(jwtService.sign).toHaveBeenCalledWith({
        email: mockUser.email,
        sub: mockUser._id,
      });
      expect(result).toStrictEqual({ accessToken: mockAccessToken });
    });

    it("should throw UnauthorizedException if user is not found", async () => {
      jest.spyOn(usersService, "findByEmail").mockResolvedValueOnce(null);

      await expect(
        authService.signIn("invalid@example.com", "password")
      ).rejects.toThrow(UnauthorizedException);

      expect(usersService.findByEmail).toHaveBeenCalledWith(
        "invalid@example.com"
      );
      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(jwtService.sign).not.toHaveBeenCalled();
    });

    it("should throw UnauthorizedException if password is incorrect", async () => {
      const mockUser = {
        _id: "123",
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: await bcrypt.hash("correct-password", 10),
      };

      jest.spyOn(usersService, "findByEmail").mockResolvedValueOnce(mockUser);
      jest.spyOn(bcrypt, "compare").mockResolvedValueOnce(false);

      await expect(
        authService.signIn("john.doe@example.com", "wrong-password")
      ).rejects.toThrow(UnauthorizedException);

      expect(usersService.findByEmail).toHaveBeenCalledWith(
        "john.doe@example.com"
      );
      expect(bcrypt.compare).toHaveBeenCalledWith(
        "wrong-password",
        mockUser.password
      );
      expect(jwtService.sign).not.toHaveBeenCalled();
    });

    it("should handle unexpected errors from UsersService", async () => {
      jest
        .spyOn(usersService, "findByEmail")
        .mockRejectedValueOnce(new Error("Database error"));

      await expect(
        authService.signIn("test@example.com", "password")
      ).rejects.toThrow(Error);

      expect(usersService.findByEmail).toHaveBeenCalledWith("test@example.com");
      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(jwtService.sign).not.toHaveBeenCalled();
    });
  });
});
