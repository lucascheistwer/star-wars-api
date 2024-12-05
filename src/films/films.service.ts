import { HttpService } from "@nestjs/axios";
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from "@nestjs/common";
import { SwapiFilm, SwapiFilmsResponse } from "./types/film.type";
import { catchError, firstValueFrom } from "rxjs";
import { AxiosError } from "axios";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { Film } from "./schemas/film.schema";
import { Model } from "mongoose";
import { CreateFilmDto, UpdateFilmDto } from "./dto/film.dto";

@Injectable()
export class FilmsService {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
    @InjectModel(Film.name) private filmModel: Model<Film>
  ) {}

  async syncFilms() {
    const films = await this.getFilmsFromApi();
    const operations = films.map((film) => ({
      updateOne: {
        filter: { title: film.title },
        update: { $set: film },
        upsert: true,
      },
    }));
    const result = await this.filmModel.bulkWrite(operations);
    return {
      upsertedCount: result.upsertedCount,
      modifiedCount: result.modifiedCount,
    };
  }

  async getFilms(): Promise<Film[]> {
    return this.filmModel.find();
  }

  async getFilmById(id: string): Promise<Film> {
    const film = await this.filmModel.findById(id);
    if (!film) {
      throw new NotFoundException("Film not found");
    }
    return film;
  }

  async createFilm(film: CreateFilmDto): Promise<Film> {
    const existingFilm = await this.filmModel.findOne({ title: film.title });
    if (existingFilm) {
      throw new BadRequestException("Film already exists");
    }
    return this.filmModel.create(film);
  }

  async updateFilm(id: string, film: UpdateFilmDto): Promise<Film> {
    const existingFilm = await this.filmModel.findById(id);
    if (!existingFilm) {
      throw new NotFoundException("Film not found");
    }
    return this.filmModel.findByIdAndUpdate(id, film, { new: true });
  }

  private async getFilmsFromApi(): Promise<SwapiFilm[]> {
    const SWAPI_URL = this.configService.get<string>("SWAPI_URL");
    const { data } = await firstValueFrom(
      this.httpService.get<SwapiFilmsResponse>(`${SWAPI_URL}/films`).pipe(
        catchError((error: AxiosError) => {
          throw new ServiceUnavailableException(error.message);
        })
      )
    );
    return data.results;
  }
}
