import { HttpService } from "@nestjs/axios";
import { Injectable, ServiceUnavailableException } from "@nestjs/common";
import { SwapiFilm, SwapiFilmsResponse } from "./types/film.type";
import { catchError, firstValueFrom } from "rxjs";
import { AxiosError } from "axios";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { Film } from "./schemas/film.schema";
import { Model } from "mongoose";

@Injectable()
export class FilmsService {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
    @InjectModel(Film.name) private filmModel: Model<Film>
  ) {}

  async syncFilms() {
    const films = await this.getFilms();
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

  private async getFilms(): Promise<SwapiFilm[]> {
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
