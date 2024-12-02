import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type FilmDocument = HydratedDocument<Film>;

@Schema()
export class Film {
  _id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  episodeId: number;

  @Prop({ required: true })
  openingCrawl: string;

  @Prop({ required: true })
  director: string;

  @Prop({ required: true })
  producer: string;

  @Prop({ required: true })
  releaseDate: string;

  @Prop({ type: [String], default: [] })
  characters: string[];

  @Prop({ type: [String], default: [] })
  planets: string[];

  @Prop({ type: [String], default: [] })
  starships: string[];

  @Prop({ type: [String], default: [] })
  vehicles: string[];

  @Prop({ type: [String], default: [] })
  species: string[];

  @Prop({ required: true })
  created: string;

  @Prop({ required: true })
  edited: string;

  @Prop({ required: true, unique: true })
  url: string;
}

export const FilmSchema = SchemaFactory.createForClass(Film);
