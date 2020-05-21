import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MovieEntity } from './movie.entity';
import { Repository, Like, Raw } from 'typeorm';
import { MovieDTO } from './movie.dto';

@Injectable()
export class MovieService {

    constructor(@InjectRepository(MovieEntity) private movieRepository: Repository<MovieEntity>){

    }

    async getAllMovies(page: number, limit: number, search: string = ''){
        const pageLimit = limit || 20
        const currentPage = page || 1
        return await this.movieRepository.find({  where: [
            { name: Raw(alias => `${alias} ILIKE '%${search}%'`) }
        ], order: {
            datecreated: "DESC"
        }, relations: ["genre"], take: pageLimit, skip: pageLimit * (currentPage - 1) });
    }

    async getLastestMovies(page: number, limit: number){
        const pageLimit = limit || 20
        const currentPage = page || 1
        return await this.movieRepository.find({ order: {
            releasedate: "DESC"
        }, relations: ["genre"], take: pageLimit, skip: pageLimit * (currentPage - 1) });
    }

    async getPopularMovies(page: number, limit: number){
        const pageLimit = limit || 20
        const currentPage = page || 1
        return await this.movieRepository.find({ order: {
            rating: "DESC",
            releasedate: "DESC"
        }, relations: ["genre"], take: pageLimit, skip: pageLimit * (currentPage - 1) });
    }

    async saveMovie(data: MovieDTO){
        const movie = await this.movieRepository.create(data);
        await this.movieRepository.save(movie);
        return movie;
    }

    async getMovie(id: string){
        let movie = await this.movieRepository.findOne({where: {id}, relations: ["genre"]});
        if(!movie){
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND)
        }
        return movie;
    }

    async updateMovie(id: string, data: Partial<MovieDTO>){
        let movie = await this.movieRepository.findOne({where: {id}});
        if(!movie){
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND)
        }
        await this.movieRepository.save({...data, id: id})
        return this.movieRepository.findOne({where: {id}, relations: ["genre"]})
    }

    async deleteMovie(id: string){
        let ids = id.split(',');
        // let movie = await this.movieRepository.findOne({where: {id}});
        // if(!movie){
        //     throw new HttpException('Not found', HttpStatus.NOT_FOUND)
        // }
        await this.movieRepository.delete(ids);
        return { deleted: true };
    }

}
 