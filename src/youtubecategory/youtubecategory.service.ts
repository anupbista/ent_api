import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { YouTubeCategoryEntity } from './youtubecategory.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Raw } from 'typeorm';
import { YouTubeCategoryDTO } from './youtubecategory.dto';

@Injectable()
export class YouTubeCategoryService {

    constructor(@InjectRepository(YouTubeCategoryEntity) private youtubecategoryRepository: Repository<YouTubeCategoryEntity>){

    }

    async getAllYouTubeCategory(page: number, limit: number, search: string = ''){
        const pageLimit = limit || 20
        const currentPage = page || 1
        return await this.youtubecategoryRepository.find({ where: [
            { name: Raw(alias => `${alias} ILIKE '%${search}%'`) }
        ], order: {
            datecreated: "DESC"
        }, take: pageLimit, skip: pageLimit * (currentPage - 1) });
    }

    async saveYouTubeCategory(data: YouTubeCategoryDTO){
        const youtubecategory = await this.youtubecategoryRepository.create(data);
        await this.youtubecategoryRepository.save(youtubecategory);
        return youtubecategory;
    }

    async getYouTubeCategory(id: string){
        let youtubecategory = await this.youtubecategoryRepository.findOne({where: {id}});
        if(!youtubecategory){
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND)
        }
        return youtubecategory;
    }

    async getYouTubeCategoryDashboard(){
        const { count } = await this.youtubecategoryRepository.createQueryBuilder('youtubecategory').select('COUNT(*)', 'count').getRawOne()
        const youtubecategorys =  await this.youtubecategoryRepository.find({ order: {
            datecreated: "DESC"
        }, take: 5, skip: 0 });
        return {
            youtubecategorys: youtubecategorys,
            count: count
        }
    }

    async updateYouTubeCategory(id: string, data: Partial<YouTubeCategoryDTO>){
        let youtubecategory = await this.youtubecategoryRepository.findOne({where: {id}});
        if(!youtubecategory){
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND)
        }
        await this.youtubecategoryRepository.update({id}, data);
        return this.youtubecategoryRepository.findOne({where: {id}})
    }

    async deleteYouTubeCategory(id: string){
        let ids = id.split(',');
        // let youtubecategory = await this.youtubecategoryRepository.findOne({where: {id}});
        // if(!youtubecategory){
        //     throw new HttpException('Not found', HttpStatus.NOT_FOUND)
        // }
        await this.youtubecategoryRepository.delete(ids);
        return { deleted: true };
    }

}
