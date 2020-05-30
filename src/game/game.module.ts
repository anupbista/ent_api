import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameEntity } from './game.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GameEntity])],
  controllers: [GameController],
  providers: [GameService]
})
export class GameModule {}
