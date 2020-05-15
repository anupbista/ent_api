import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UserEntity } from './user.entity';
import { UserDTO } from './user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {

    constructor(@InjectRepository(UserEntity) private userRepository: Repository<UserEntity>){}

    async getAllUsers(){
        return await this.userRepository.find();
    }

    async saveUser(data: UserDTO){
        const user = await this.userRepository.create(data);
        await this.userRepository.save(user);
        return user;
    }

    async getUser(id: string){
        let user = await this.userRepository.findOne({where: {id} });
        if(!user){
            throw new HttpException('Not found', HttpStatus.NOT_FOUND)
        }
        return user;
    }

    async getUserPass(username: string){
        let user = await this.userRepository.findOne({where: {username}, select: ['id', 'username', 'password'] });
        if(!user){
            throw new HttpException('Not found', HttpStatus.NOT_FOUND)
        }
        return user;
    }

    async getUserByUsername(username: string): Promise<UserDTO> {
        return await this.userRepository.findOne({
            where: {
                username: username,
            }
        });
    }

    async updateUser(id: string, data: Partial<UserDTO>){
        let user = await this.userRepository.findOne({where: {id}});
        if(!user){
            throw new HttpException('Not found', HttpStatus.NOT_FOUND)
        }
        await this.userRepository.update({id}, data);
        return this.userRepository.findOne({where: {id}})
    }

    async deleteUser(id: string){
        let user = await this.userRepository.findOne({where: {id}});
        if(!user){
            throw new HttpException('Not found', HttpStatus.NOT_FOUND)
        }
        await this.userRepository.delete({id});
        return { deleted: true };
    }

}
