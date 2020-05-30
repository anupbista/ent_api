import { Module } from '@nestjs/common';
import { YouTubeCategoryController } from './youtubecategory.controller';
import { YouTubeCategoryService } from './youtubecategory.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { YouTubeCategoryEntity } from './youtubecategory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([YouTubeCategoryEntity])],
  controllers: [YouTubeCategoryController],
  providers: [YouTubeCategoryService]
})
export class YoutubecategoryModule {}
