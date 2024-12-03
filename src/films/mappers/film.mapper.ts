import { Film } from "../schemas/film.schema";

export const mapFilmToDto = (swapiFilm: Film) => ({
  _id: swapiFilm._id,
  title: swapiFilm.title,
  releaseDate: swapiFilm.releaseDate,
  url: swapiFilm.url,
  director: swapiFilm.director,
  producer: swapiFilm.producer,
  openingCrawl: swapiFilm.openingCrawl,
  characters: swapiFilm.characters,
  planets: swapiFilm.planets,
  starships: swapiFilm.starships,
  vehicles: swapiFilm.vehicles,
  species: swapiFilm.species,
  created: swapiFilm.created,
  edited: swapiFilm.edited,
});
