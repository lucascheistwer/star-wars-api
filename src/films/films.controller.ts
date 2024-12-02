import { Controller, Post } from "@nestjs/common";
import { FilmsService } from "./films.service";

@Controller("films")
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Post("sync")
  async syncFilms() {
    return this.filmsService.syncFilms();
  }
}
