import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CategoryEntity } from './category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Raw } from 'typeorm';
import { CategoryDTO } from './category.dto';

@Injectable()
export class CategoryService {

    constructor(@InjectRepository(CategoryEntity) private categoryRepository: Repository<CategoryEntity>){

    }

    async getAllCategory(page: number, limit: number, search: string = ''){
        const pageLimit = limit || 20
        const currentPage = page || 1
        return await this.categoryRepository.find({ where: [
            { name: Raw(alias => `${alias} ILIKE '%${search}%'`) }
        ], order: {
            datecreated: "DESC"
        }, take: pageLimit, skip: pageLimit * (currentPage - 1) });
    }

    async saveCategory(data: CategoryDTO){
        const category = await this.categoryRepository.create(data);
        await this.categoryRepository.save(category);
        return category;
    }

    async getCategory(id: string){
        let category = await this.categoryRepository.findOne({where: {id}});
        if(!category){
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND)
        }
        return category;
    }

    async getCategoryDashboard(){
        const { count } = await this.categoryRepository.createQueryBuilder('category').select('COUNT(*)', 'count').getRawOne()
        const categorys =  await this.categoryRepository.find({ order: {
            datecreated: "DESC"
        }, take: 5, skip: 0 });
        return {
            categorys: categorys,
            count: count
        }
    }

    async updateCategory(id: string, data: Partial<CategoryDTO>){
        let category = await this.categoryRepository.findOne({where: {id}});
        if(!category){
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND)
        }
        await this.categoryRepository.update({id}, data);
        return this.categoryRepository.findOne({where: {id}})
    }

    async deleteCategory(id: string){
        let ids = id.split(',');
        // let category = await this.categoryRepository.findOne({where: {id}});
        // if(!category){
        //     throw new HttpException('Not found', HttpStatus.NOT_FOUND)
        // }
        await this.categoryRepository.delete(ids);
        return { deleted: true };
    }

}
