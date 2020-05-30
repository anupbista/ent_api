import { Module } from '@nestjs/common';
import { YouTubeVideoController } from './youtubevideo.controller';
import { YouTubeVideoService } from './youtubevideo.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { YouTubeVideoEntity } from './youtubevideo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([YouTubeVideoEntity])],
  controllers: [YouTubeVideoController],
  providers: [YouTubeVideoService]
})
export class YoutubevideoModule {}
