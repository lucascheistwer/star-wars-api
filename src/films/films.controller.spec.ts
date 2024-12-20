import { Test, TestingModule } from "@nestjs/testing";
import { FilmsController } from "./films.controller";
import { FilmsService } from "./films.service";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import {
  createFilmMock,
  mockFilm,
  mockFilms,
} from "../../test/mocks/film.mock";
import { RolesGuard } from "src/common/guards/roles.guard";
import { BadRequestException, NotFoundException } from "@nestjs/common";

describe("FilmsController", () => {
  let filmsController: FilmsController;
  let filmsService: FilmsService;

  beforeEach(async () => {
    const mockFilmsService = {
      syncFilms: jest.fn().mockResolvedValue({
        upsertedCount: 1,
        modifiedCount: 0,
      }),
      getFilms: jest.fn().mockResolvedValue(mockFilms),
      getFilmById: jest.fn().mockResolvedValue(mockFilm),
      createFilm: jest.fn().mockResolvedValue(mockFilm),
      updateFilm: jest.fn().mockResolvedValue(mockFilm),
      deleteFilm: jest.fn().mockResolvedValue(mockFilm),
    };

    const mockUsersService = {
      findUserById: jest.fn().mockResolvedValue({ id: "1", role: "admin" }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [
        {
          provide: FilmsService,
          useValue: mockFilmsService,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        JwtService,
        Reflector,
        RolesGuard,
      ],
    }).compile();

    filmsController = module.get<FilmsController>(FilmsController);
    filmsService = module.get<FilmsService>(FilmsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("syncFilms", () => {
    it("should call FilmsService.syncFilms and return its result", async () => {
      const result = await filmsController.syncFilms();
      expect(filmsService.syncFilms).toHaveBeenCalled();
      expect(result).toEqual({
        upsertedCount: 1,
        modifiedCount: 0,
      });
    });
  });

  describe("getFilms", () => {
    it("should call FilmsService.getFilms and map the results", async () => {
      const result = await filmsController.getFilms();
      expect(filmsService.getFilms).toHaveBeenCalled();
      expect(result).toEqual(mockFilms);
    });
  });

  describe("getFilmById", () => {
    it("should call FilmsService.getFilmById with the correct id and return the result", async () => {
      const id = "1";
      const result = await filmsController.getFilmById(id);
      expect(filmsService.getFilmById).toHaveBeenCalledWith(id);
      expect(result).toEqual(mockFilm);
    });

    it("should throw an error if FilmsService.getFilmById throws an error", async () => {
      const id = "2";
      const exception = new NotFoundException("Film not found");
      jest.spyOn(filmsService, "getFilmById").mockRejectedValue(exception);
      await expect(filmsController.getFilmById(id)).rejects.toThrow(exception);
    });
  });

  describe("createFilm", () => {
    it("should call FilmsService.createFilm with the correct arguments", async () => {
      await filmsController.createFilm(createFilmMock);
      expect(filmsService.createFilm).toHaveBeenCalledWith(createFilmMock);
    });

    it("should throw an error if FilmsService.createFilm throws an error", async () => {
      const exception = new BadRequestException("Film already exists");
      jest.spyOn(filmsService, "createFilm").mockRejectedValue(exception);
      await expect(filmsController.createFilm(createFilmMock)).rejects.toThrow(
        exception
      );
    });
  });

  describe("updateFilm", () => {
    it("should call FilmsService.updateFilm with the correct arguments", async () => {
      const id = "1";
      const updateFilmMock = { title: "Updated Film" };
      await filmsController.updateFilm(id, updateFilmMock);
      expect(filmsService.updateFilm).toHaveBeenCalledWith(id, updateFilmMock);
    });

    it("should throw an error if FilmsService.updateFilm throws an error", async () => {
      const id = "2";
      const updateFilmMock = { title: "Updated Film" };
      const exception = new NotFoundException("Film not found");
      jest.spyOn(filmsService, "updateFilm").mockRejectedValue(exception);
      await expect(
        filmsController.updateFilm(id, updateFilmMock)
      ).rejects.toThrow(exception);
    });
  });

  describe("deleteFilm", () => {
    it("should call FilmsService.deleteFilm with the correct id", async () => {
      const id = "1";
      await filmsController.deleteFilm(id);
      expect(filmsService.deleteFilm).toHaveBeenCalledWith(id);
    });

    it("should throw an error if FilmsService.deleteFilm throws an error", async () => {
      const id = "2";
      const exception = new NotFoundException("Film not found");
      jest.spyOn(filmsService, "deleteFilm").mockRejectedValue(exception);
      await expect(filmsController.deleteFilm(id)).rejects.toThrow(exception);
    });
  });
});
