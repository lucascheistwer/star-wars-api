import { Module } from "@nestjs/common";
import { FilmsService } from "./films.service";
import { FilmsController } from "./films.controller";
import { HttpModule } from "@nestjs/axios";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { Film, FilmSchema } from "./schemas/film.schema";
import { AuthModule } from "src/auth/auth.module";

@Module({
  imports: [
    HttpModule,
    ConfigModule,
    MongooseModule.forFeature([{ name: Film.name, schema: FilmSchema }]),
    AuthModule,
  ],
  providers: [FilmsService],
  controllers: [FilmsController],
})
export class FilmsModule {}
