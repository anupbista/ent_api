import { Injectable } from '@nestjs/common';
import { UserInfoEntity } from './userinfo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserInfoDTO } from './userinfo.dto';

@Injectable()
export class UserInfoService {

    constructor(@InjectRepository(UserInfoEntity) private userInfoRepository: Repository<UserInfoEntity>){}

    async getUserInfo(userid: string, token: string){
        if(token){
            let userInfo = await this.userInfoRepository.findOne({where: {userid: userid, token: token} });
            return userInfo || null;
        }else{
            let userInfo = await this.userInfoRepository.find({where: {userid: userid} });
            return userInfo || null;
        }
    }

    async saveUserInfo(data: UserInfoDTO){
        const userInfo = await this.userInfoRepository.create(data);
        await this.userInfoRepository.save(userInfo);
        return userInfo;
    }

    async deleteUserInfo(ids: string[]){
        await this.userInfoRepository.delete(ids);
        return { deleted: true };
    }

}
