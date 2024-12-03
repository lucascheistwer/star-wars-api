import { Controller, Get, Post } from "@nestjs/common";
import { FilmsService } from "./films.service";
import { mapFilmToDto } from "./mappers/film.mapper";

@Controller("films")
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Post("sync")
  async syncFilms() {
    return this.filmsService.syncFilms();
  }

  @Get()
  async getFilms() {
    const films = await this.filmsService.getFilms();
    return films.map((film) => mapFilmToDto(film));
  }
}
