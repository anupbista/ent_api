import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { YouTubeVideoEntity } from './youtubevideo.entity';
import { Repository } from 'typeorm';
import { YouTubeVideoDTO } from './youtubevideo.dto';

@Injectable()
export class YouTubeVideoService {

    constructor(@InjectRepository(YouTubeVideoEntity) private youtubevideoRepository: Repository<YouTubeVideoEntity>){

    }

    async getAllYouTubeVideos(page: number, limit: number, search: string = '', category: string = ''){
        const pageLimit = limit || 20
        const currentPage = page || 1
        // return await this.youtubevideoRepository.find({  where: [
        //     { name: Raw(alias => `${alias} ILIKE '%${search}%'`) }
        // ], order: {
        //     datecreated: "DESC"
        // }, relations: ["category"], take: pageLimit, skip: pageLimit * (currentPage - 1) });

        const [result, total] = await this.youtubevideoRepository.createQueryBuilder("YouTubeVideoEntity")
        .leftJoinAndSelect("YouTubeVideoEntity.category", "YouTubeCategoryEntity")
        .where(search != '' ? "YouTubeVideoEntity.name ILIKE :name" : '1=1', { name: '%' + search + '%' })
        .andWhere( category != '' ? "YouTubeCategoryEntity.id = :gid" : '1=1', { gid: category })
        .orderBy("YouTubeVideoEntity.datecreated", "DESC")
        .limit(pageLimit)
        .offset(pageLimit * (currentPage - 1))
        .getManyAndCount();
        return {
            data: result,
            count: total
        }
    }

    async saveYouTubeVideo(data: YouTubeVideoDTO){
        const youtubevideo = await this.youtubevideoRepository.create(data);
        await this.youtubevideoRepository.save(youtubevideo);
        return youtubevideo;
    }

    async getYouTubeVideo(id: string){
        let youtubevideo = await this.youtubevideoRepository.findOne({where: {id}, relations: ["category"]});
        if(!youtubevideo){
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND)
        }
        return youtubevideo;
    }

    async getYouTubeVideoDashboard(){
        const { count } = await this.youtubevideoRepository.createQueryBuilder('youtubevideo').select('COUNT(*)', 'count').getRawOne()
        const youtubevideos =  await this.youtubevideoRepository.find({ order: {
            datecreated: "DESC"
        }, take: 5, skip: 0 });
        return {
            youtubevideos: youtubevideos,
            count: count
        }
       
    }

    async updateYouTubeVideo(id: string, data: Partial<YouTubeVideoDTO>){
        let youtubevideo = await this.youtubevideoRepository.findOne({where: {id}});
        if(!youtubevideo){
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND)
        }
        await this.youtubevideoRepository.save({...data, id: id})
        return this.youtubevideoRepository.findOne({where: {id}, relations: ["category"]})
    }

    async deleteYouTubeVideo(id: string){
        let ids = id.split(',');
        // let youtubevideo = await this.youtubevideoRepository.findOne({where: {id}});
        // if(!youtubevideo){
        //     throw new HttpException('Not found', HttpStatus.NOT_FOUND)
        // }
        await this.youtubevideoRepository.delete(ids);
        return { deleted: true };
    }

}
 