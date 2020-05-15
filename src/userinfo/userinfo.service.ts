import { Injectable } from '@nestjs/common';
import { UserInfoEntity } from './userinfo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserInfoDTO } from './userinfo.dto';

@Injectable()
export class UserInfoService {

    constructor(@InjectRepository(UserInfoEntity) private userInfoRepository: Repository<UserInfoEntity>){}

    async getUserInfo(userid: string){
        let userInfo = await this.userInfoRepository.findOne({where: {userid} });
        if(!userInfo){
            return null
        }
        return userInfo;
    }

    async saveUserInfo(data: UserInfoDTO){
        const userInfo = await this.userInfoRepository.create(data);
        await this.userInfoRepository.save(userInfo);
        return userInfo;
    }

    async deleteUserInfo(userid: string){
        await this.userInfoRepository.delete({userid});
        return { deleted: true };
    }

}
