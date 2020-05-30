import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Raw, MoreThan } from 'typeorm';
import { YouTubeChannelEntity } from './youtubechannel.entity';
import { YouTubeChannelDTO } from './youtubechannel.dto';

@Injectable()
export class YouTubeChannelService {

    constructor(@InjectRepository(YouTubeChannelEntity) private youtubechannelRepository: Repository<YouTubeChannelEntity>){

    }

    async getAllYouTubeChannels(page: number, limit: number, search: string = ''){
        const pageLimit = limit || 20
        const currentPage = page || 1
        const [result, total] = await this.youtubechannelRepository.findAndCount({ where: [
            { name: Raw(alias => `${alias} ILIKE '%${search}%'`) }
        ], order: {
            datecreated: "DESC"
        }, take: pageLimit, skip: pageLimit * (currentPage - 1) });
        return {
            data: result,
            count: total
        }
    }

    async saveYouTubeChannel(data: YouTubeChannelDTO){
        const youtubechannel = await this.youtubechannelRepository.create(data);
        await this.youtubechannelRepository.save(youtubechannel);
        return youtubechannel;
    }

    async getYouTubeChannel(id: string){
        let youtubechannel = await this.youtubechannelRepository.findOne({where: {id}});
        if(!youtubechannel){
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND)
        }
        return youtubechannel;
    }

    async getYouTubeChannelDashboard(){
        const { count } = await this.youtubechannelRepository.createQueryBuilder('youtubechannel').select('COUNT(*)', 'count').getRawOne()
        const youtubechannels =  await this.youtubechannelRepository.find({ order: {
            datecreated: "DESC"
        }, take: 5, skip: 0 });
        return {
            youtubechannels: youtubechannels,
            count: count
        }
    }

    async updateYouTubeChannel(id: string, data: Partial<YouTubeChannelDTO>){
        let youtubechannel = await this.youtubechannelRepository.findOne({where: {id}});
        if(!youtubechannel){
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND)
        }
        await this.youtubechannelRepository.update({id}, data);
        return this.youtubechannelRepository.findOne({where: {id}})
    }

    async deleteYouTubeChannel(id: string){
        let ids = id.split(',');
        // let youtubechannel = await this.youtubechannelRepository.findOne({where: {id}});
        // if(!youtubechannel){
        //     throw new HttpException('Not found', HttpStatus.NOT_FOUND)
        // }
        await this.youtubechannelRepository.delete(ids);
        return { deleted: true };
    }

}
 