import { FilmDto } from "src/films/dto/film.dto";

export const mockFilm = {
  _id: "674e140ab826f02432119699",
  title: "A New Hope",
  url: "https://swapi.dev/api/films/1/",
  director: "George Lucas",
  producer: "Gary Kurtz, Rick McCallum",
  characters: ["https://swapi.dev/api/people/1/"],
  planets: ["https://swapi.dev/api/planets/1/"],
  starships: ["https://swapi.dev/api/starships/2/"],
  vehicles: ["https://swapi.dev/api/vehicles/4/"],
  species: ["https://swapi.dev/api/species/1/"],
  created: "2014-12-10T14:23:31.880000Z",
  edited: "2014-12-20T19:49:45.256000Z",
};

export const createFilmMock = {
  title: "A New Hope",
  episodeId: 4,
  director: "George Lucas",
  producer: "Gary Kurtz, Rick McCallum",
  releaseDate: "1977-05-25",
};

export const mockFilms = [mockFilm] as FilmDto[];
