export type FilmDto = {
  _id: string;
  title: string;
  releaseDate: string;
  url: string;
  episodeId?: number;
  director: string;
  producer: string;
  openingCrawl: string;
  characters: string[];
  planets: string[];
  starships: string[];
  vehicles: string[];
  species: string[];
  created: string;
  edited: string;
};
