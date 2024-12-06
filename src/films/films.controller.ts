import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  ValidationPipe,
} from "@nestjs/common";
import { FilmsService } from "./films.service";
import { mapFilmToDto } from "./mappers/film.mapper";
import { RolesGuard } from "src/common/guards/roles.guard";
import { Roles } from "src/common/guards/roles.decorator";
import { Role } from "src/common/enums/roles.enum";
import { ValidateObjectIdPipe } from "src/common/pipes/object-id.pipe";
import { CreateFilmDto, UpdateFilmDto } from "./dto/film.dto";

@Controller("films")
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Post("sync")
  async syncFilms() {
    return this.filmsService.syncFilms();
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  async createFilm(@Body(new ValidationPipe()) createFilmDto: CreateFilmDto) {
    const film = await this.filmsService.createFilm(createFilmDto);
    return mapFilmToDto(film);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(":id")
  async updateFilm(
    @Param("id", ValidateObjectIdPipe) id: string,
    @Body(new ValidationPipe()) updateFilmDto: UpdateFilmDto
  ) {
    const film = await this.filmsService.updateFilm(id, updateFilmDto);
    return mapFilmToDto(film);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(":id")
  async deleteFilm(@Param("id", ValidateObjectIdPipe) id: string) {
    return this.filmsService.deleteFilm(id);
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
