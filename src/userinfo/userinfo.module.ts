import { Module, Global } from '@nestjs/common';
import { UserInfoController } from './userinfo.controller';
import { UserInfoService } from './userinfo.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserInfoEntity } from './userinfo.entity';

@Global()
@Module({
  imports: [ TypeOrmModule.forFeature([ UserInfoEntity ]) ],
  controllers: [UserInfoController],
  providers: [UserInfoService],
  exports: [UserInfoService]
})
export class UserInfoModule {}
