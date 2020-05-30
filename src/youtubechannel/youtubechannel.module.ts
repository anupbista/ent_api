import { Module } from '@nestjs/common';
import { YouTubeChannelController } from './youtubechannel.controller';
import { YouTubeChannelService } from './youtubechannel.service';
import { YouTubeChannelEntity } from './youtubechannel.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([YouTubeChannelEntity])],
  controllers: [YouTubeChannelController],
  providers: [YouTubeChannelService]
})
export class YoutubechannelModule {}
