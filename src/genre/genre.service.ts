import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { GenreEntity } from './genre.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GenreDTO } from './genre.dto';

@Injectable()
export class GenreService {

    constructor(@InjectRepository(GenreEntity) private genreRepository: Repository<GenreEntity>){

    }

    async getAllGenres(){
        return await this.genreRepository.find();
    }

    async saveGenre(data: GenreDTO){
        const genre = await this.genreRepository.create(data);
        await this.genreRepository.save(genre);
        return genre;
    }

    async getGenre(id: string){
        let genre = await this.genreRepository.findOne({where: {id}});
        if(!genre){
            throw new HttpException('Not found', HttpStatus.NOT_FOUND)
        }
        return genre;
    }

    async updateGenre(id: string, data: Partial<GenreDTO>){
        let genre = await this.genreRepository.findOne({where: {id}});
        if(!genre){
            throw new HttpException('Not found', HttpStatus.NOT_FOUND)
        }
        await this.genreRepository.update({id}, data);
        return this.genreRepository.findOne({where: {id}})
    }

    async deleteGenre(id: string){
        let ids = id.split(',');
        // let genre = await this.genreRepository.findOne({where: {id}});
        // if(!genre){
        //     throw new HttpException('Not found', HttpStatus.NOT_FOUND)
        // }
        await this.genreRepository.delete(ids);
        return { deleted: true };
    }

}
