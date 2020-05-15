import { Module } from '@nestjs/common';
import { UserEntity } from '../user/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../const/key.const';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { UserInfoModule } from '../userinfo/userinfo.module';

@Module({
    imports: [UserModule, UserInfoModule, TypeOrmModule.forFeature([UserEntity]),
    JwtModule.register({
        secretOrPrivateKey: jwtConstants.secret
    })],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy]
})
export class AuthModule {
}
