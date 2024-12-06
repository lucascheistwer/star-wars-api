import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export type FilmDto = {
  _id: string;
  title: string;
  releaseDate: string;
  url?: string;
  episodeId?: number;
  director?: string;
  producer?: string;
  openingCrawl?: string;
  characters?: string[];
  planets?: string[];
  starships?: string[];
  vehicles?: string[];
  species?: string[];
  created?: string;
  edited?: string;
};

export class CreateFilmDto {
  @ApiProperty({
    description: "Title of the film",
    example: "Star Wars: A New Hope",
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: "Release date of the film in ISO format",
    example: "1977-05-25",
  })
  @IsNotEmpty()
  @IsDateString()
  releaseDate: string;

  @ApiProperty({
    description: "URL of the film resource",
    example: "https://swapi.dev/api/films/1/",
    required: false,
  })
  @IsOptional()
  @IsString()
  url?: string;

  @ApiProperty({
    description: "Episode ID of the film",
    example: 4,
    required: false,
  })
  @IsOptional()
  @IsString()
  episodeId?: number;

  @ApiProperty({
    description: "Director of the film",
    example: "George Lucas",
    required: false,
  })
  @IsOptional()
  @IsString()
  director?: string;

  @ApiProperty({
    description: "Producer(s) of the film",
    example: "Gary Kurtz, Rick McCallum",
    required: false,
  })
  @IsOptional()
  @IsString()
  producer?: string;

  @ApiProperty({
    description: "Opening crawl text of the film",
    example: "It is a period of civil war...",
    required: false,
  })
  @IsOptional()
  @IsString()
  openingCrawl?: string;

  @ApiProperty({
    description: "Array of character URLs",
    example: [
      "https://swapi.dev/api/people/1/",
      "https://swapi.dev/api/people/2/",
    ],
    required: false,
  })
  @IsOptional()
  @IsString({ each: true })
  characters?: string[];

  @ApiProperty({
    description: "Array of planet URLs",
    example: [
      "https://swapi.dev/api/planets/1/",
      "https://swapi.dev/api/planets/2/",
    ],
    required: false,
  })
  @IsOptional()
  @IsString({ each: true })
  planets?: string[];

  @ApiProperty({
    description: "Array of starship URLs",
    example: [
      "https://swapi.dev/api/starships/1/",
      "https://swapi.dev/api/starships/2/",
    ],
    required: false,
  })
  @IsOptional()
  @IsString({ each: true })
  starships?: string[];

  @ApiProperty({
    description: "Array of vehicle URLs",
    example: [
      "https://swapi.dev/api/vehicles/1/",
      "https://swapi.dev/api/vehicles/2/",
    ],
    required: false,
  })
  @IsOptional()
  @IsString({ each: true })
  vehicles?: string[];

  @ApiProperty({
    description: "Array of species URLs",
    example: [
      "https://swapi.dev/api/species/1/",
      "https://swapi.dev/api/species/2/",
    ],
    required: false,
  })
  @IsOptional()
  @IsString({ each: true })
  species?: string[];

  @ApiProperty({
    description: "Creation timestamp",
    example: "2024-01-01T12:00:00Z",
    required: false,
  })
  @IsOptional()
  @IsString()
  created?: string;

  @ApiProperty({
    description: "Last edited timestamp",
    example: "2024-01-02T12:00:00Z",
    required: false,
  })
  @IsOptional()
  @IsString()
  edited?: string;
}

export type UpdateFilmDto = Partial<CreateFilmDto>;
