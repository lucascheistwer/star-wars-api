import { Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { FilmsService } from "./films.service";
import { mapFilmToDto } from "./mappers/film.mapper";
import { RolesGuard } from "src/common/guards/roles.guard";
import { Roles } from "src/common/guards/roles.decorator";
import { Role } from "src/common/enums/roles.enum";
import { ValidateObjectIdPipe } from "src/common/pipes/object-id.pipe";

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

  @UseGuards(RolesGuard)
  @Roles(Role.REGULAR)
  @Get(":id")
  async getFilmById(@Param("id", ValidateObjectIdPipe) id: string) {
    const film = await this.filmsService.getFilmById(id);
    return mapFilmToDto(film);
  }
}
