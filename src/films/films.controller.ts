import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from "@nestjs/swagger";
import { FILMS_EXAMPLES } from "./films.examples";

@Controller("films")
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @ApiOperation({ summary: "Synchronize films with an external source" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Films synchronized successfully.",
  })
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Post("sync")
  async syncFilms() {
    return this.filmsService.syncFilms();
  }

  @ApiOperation({ summary: "Create a new film" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Film created successfully.",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Film already exists.",
  })
  @ApiBody({
    description: "Film details",
    type: CreateFilmDto,
    examples: FILMS_EXAMPLES.create,
  })
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  async createFilm(@Body(new ValidationPipe()) createFilmDto: CreateFilmDto) {
    const film = await this.filmsService.createFilm(createFilmDto);
    return mapFilmToDto(film);
  }

  @ApiOperation({ summary: "Update an existing film" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Film updated successfully.",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Film not found.",
  })
  @ApiParam({ name: "id", description: "Film ID" })
  @ApiBody({
    description: "Film details to update",
    examples: FILMS_EXAMPLES.update,
  })
  @ApiBearerAuth()
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

  @ApiOperation({ summary: "Delete a film" })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: "Film deleted successfully.",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Film not found.",
  })
  @ApiParam({ name: "id", description: "Film ID" })
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(":id")
  async deleteFilm(@Param("id", ValidateObjectIdPipe) id: string) {
    await this.filmsService.deleteFilm(id);
  }

  @ApiOperation({ summary: "Retrieve a list of films" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "List of films retrieved successfully.",
  })
  @Get()
  async getFilms() {
    const films = await this.filmsService.getFilms();
    return films.map((film) => mapFilmToDto(film));
  }

  @ApiOperation({ summary: "Retrieve details of a specific film" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Film details retrieved successfully.",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Film not found.",
  })
  @ApiParam({ name: "id", description: "Film ID" })
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(Role.REGULAR)
  @Get(":id")
  async getFilmById(@Param("id", ValidateObjectIdPipe) id: string) {
    const film = await this.filmsService.getFilmById(id);
    return mapFilmToDto(film);
  }
}
