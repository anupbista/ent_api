import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MovieModule } from './movie/movie.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpErrorFilter } from './shared/http-error.filter';
import { LogInterceptor } from './shared/log.interceptor';
import { GenreModule } from './genre/genre.module';
import { UserModule } from './user/user.module';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './auth/auth.module';
import { BookModule } from './book/book.module';
import { UserInfoModule } from './userinfo/userinfo.module';
import { CategoryModule } from './category/category.module';
import { GameModule } from './game/game.module';
import { YoutubevideoModule } from './youtubevideo/youtubevideo.module';
import { YoutubecategoryModule } from './youtubecategory/youtubecategory.module';
import { YoutubechannelModule } from './youtubechannel/youtubechannel.module';

@Module({
  imports: [TypeOrmModule.forRoot(), MovieModule, GenreModule, UserModule, SharedModule, AuthModule, BookModule, UserInfoModule, CategoryModule, GameModule, YoutubevideoModule, YoutubecategoryModule, YoutubechannelModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LogInterceptor
    }
  ],
})
export class AppModule {}
  