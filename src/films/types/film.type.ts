export type SwapiFilm = {
  characters: string[];
  created: string;
  director: string;
  edited: string;
  episodeId: number;
  openingCrawl: string;
  planets: string[];
  producer: string;
  releaseDate: string;
  species: string[];
  starships: string[];
  title: string;
  url: string;
  vehicles: string[];
};

export type SwapiFilmsResponse = {
  results: SwapiFilm[];
};
