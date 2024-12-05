import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type FilmDocument = HydratedDocument<Film>;

@Schema()
export class Film {
  _id: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  episodeId?: number;

  @Prop()
  openingCrawl?: string;

  @Prop({ required: true })
  director: string;

  @Prop()
  producer: string;

  @Prop()
  releaseDate?: string;

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

  @Prop()
  created: string;

  @Prop()
  edited: string;

  @Prop()
  url: string;
}

export const FilmSchema = SchemaFactory.createForClass(Film);
