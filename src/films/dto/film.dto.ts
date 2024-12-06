import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";

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
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsDateString()
  @IsString()
  releaseDate: string;

  @IsOptional()
  @IsString()
  url?: string;

  @IsOptional()
  @IsString()
  episodeId?: number;

  @IsOptional()
  @IsString()
  director?: string;

  @IsOptional()
  @IsString()
  producer?: string;

  @IsOptional()
  @IsString()
  openingCrawl?: string;

  @IsOptional()
  @IsString()
  characters?: string[];

  @IsOptional()
  @IsString()
  planets?: string[];

  @IsOptional()
  @IsString()
  starships?: string[];

  @IsOptional()
  @IsString()
  vehicles?: string[];

  @IsOptional()
  @IsString()
  species?: string[];

  @IsOptional()
  @IsString()
  created?: string;

  @IsOptional()
  @IsString()
  edited?: string;
}

export type UpdateFilmDto = Partial<CreateFilmDto>;
