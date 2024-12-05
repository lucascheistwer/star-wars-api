import { Test, TestingModule } from "@nestjs/testing";
import { FilmsService } from "./films.service";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { getModelToken } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Film } from "./schemas/film.schema";
import {
  BadRequestException,
  NotFoundException,
  ServiceUnavailableException,
} from "@nestjs/common";
import { of, throwError } from "rxjs";
import { AxiosError } from "axios";
import { createFilmMock } from "../../test/mocks/film.mock";

const mockFilms = [{ title: "Film 1" }, { title: "Film 2" }];
const mockAxiosResponse = {
  data: { results: mockFilms },
  status: 200,
  statusText: "OK",
  headers: {},
  config: { headers: {} as any },
};

describe("FilmsService", () => {
  let configService: ConfigService;
  let filmsService: FilmsService;
  let httpService: HttpService;
  let filmModel: jest.Mocked<Model<Film>>;

  beforeEach(async () => {
    const mockConfigService = {
      get: jest.fn((key: string) => {
        if (key === "SWAPI_URL") {
          return "https://swapi.dev/api";
        }
      }),
    };

    const mockFilmModel = {
      find: jest.fn(),
      findById: jest.fn(),
      bulkWrite: jest.fn(),
      create: jest.fn(),
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilmsService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: getModelToken(Film.name), useValue: mockFilmModel },
      ],
    }).compile();

    filmsService = module.get<FilmsService>(FilmsService);
    httpService = module.get<HttpService>(HttpService);
    configService = module.get<ConfigService>(ConfigService);
    filmModel = module.get(getModelToken(Film.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("syncFilms", () => {
    it("should sync films and return the counts", async () => {
      jest.spyOn(httpService, "get").mockReturnValue(of(mockAxiosResponse));
      filmModel.bulkWrite.mockResolvedValue({
        upsertedCount: 1,
        modifiedCount: 1,
      } as any);

      const result = await filmsService.syncFilms();

      expect(httpService.get).toHaveBeenCalledWith(
        "https://swapi.dev/api/films"
      );
      expect(filmModel.bulkWrite).toHaveBeenCalledWith([
        {
          updateOne: {
            filter: { title: "Film 1" },
            update: { $set: { title: "Film 1" } },
            upsert: true,
          },
        },
        {
          updateOne: {
            filter: { title: "Film 2" },
            update: { $set: { title: "Film 2" } },
            upsert: true,
          },
        },
      ]);
      expect(result).toEqual({ upsertedCount: 1, modifiedCount: 1 });
    });

    it("should throw ServiceUnavailableException when API call fails", async () => {
      jest
        .spyOn(httpService, "get")
        .mockReturnValue(throwError(() => new AxiosError("Network Error")));

      await expect(filmsService.syncFilms()).rejects.toThrow(
        ServiceUnavailableException
      );

      expect(httpService.get).toHaveBeenCalled();
      expect(filmModel.bulkWrite).not.toHaveBeenCalled();
    });
  });

  describe("getFilms", () => {
    it("should return a list of films", async () => {
      filmModel.find.mockResolvedValue(mockFilms);

      const result = await filmsService.getFilms();

      expect(filmModel.find).toHaveBeenCalled();
      expect(result).toEqual(mockFilms);
    });
  });

  describe("getFilmById", () => {
    it("should return the film by id", async () => {
      const mockFilm = { title: "Film 1" };
      filmModel.findById.mockResolvedValue(mockFilm);

      const result = await filmsService.getFilmById("validMongoId");

      expect(filmModel.findById).toHaveBeenCalledWith("validMongoId");
      expect(result).toEqual(mockFilm);
    });

    it("should throw NotFoundException if the film is not found", async () => {
      filmModel.findById.mockResolvedValue(null);

      await expect(filmsService.getFilmById("nonexistentId")).rejects.toThrow(
        NotFoundException
      );

      expect(filmModel.findById).toHaveBeenCalledWith("nonexistentId");
    });
  });

  describe("getFilmsFromApi", () => {
    it("should fetch films from the external API", async () => {
      const mockFilmsFromApi = [{ title: "Film 1" }, { title: "Film 2" }];
      jest.spyOn(httpService, "get").mockReturnValue(of(mockAxiosResponse));

      const result = await filmsService["getFilmsFromApi"]();

      expect(httpService.get).toHaveBeenCalledWith(
        "https://swapi.dev/api/films"
      );
      expect(result).toEqual(mockFilmsFromApi);
    });

    it("should throw ServiceUnavailableException when the external API call fails", async () => {
      jest
        .spyOn(httpService, "get")
        .mockReturnValue(throwError(() => new AxiosError("Network Error")));

      await expect(filmsService["getFilmsFromApi"]()).rejects.toThrow(
        ServiceUnavailableException
      );

      expect(httpService.get).toHaveBeenCalled();
    });
  });

  describe("createFilm", () => {
    it("should create a new film", async () => {
      filmModel.findOne.mockResolvedValue(null);
      filmModel.create.mockResolvedValue(createFilmMock as any);

      const result = await filmsService.createFilm(createFilmMock);

      expect(filmModel.findOne).toHaveBeenCalledWith({
        title: createFilmMock.title,
      });
      expect(filmModel.create).toHaveBeenCalledWith(createFilmMock);
      expect(result).toEqual(createFilmMock);
    });

    it("should throw BadRequestException if the film already exists", async () => {
      filmModel.findOne.mockResolvedValue(createFilmMock as any);

      await expect(filmsService.createFilm(createFilmMock)).rejects.toThrow(
        BadRequestException
      );

      expect(filmModel.findOne).toHaveBeenCalledWith({
        title: createFilmMock.title,
      });
      expect(filmModel.create).not.toHaveBeenCalled();
    });
  });
});
