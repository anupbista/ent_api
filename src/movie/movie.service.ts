import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MovieEntity } from './movie.entity';
import { Repository } from 'typeorm';
import { MovieDTO } from './movie.dto';

@Injectable()
export class MovieService {

    constructor(@InjectRepository(MovieEntity) private movieRepository: Repository<MovieEntity>){

    }

    async getAllMovies(){
        return await this.movieRepository.find({ relations: ["genre"] });
    }

    async saveMovie(data: MovieDTO){
        const movie = await this.movieRepository.create(data);
        await this.movieRepository.save(movie);
        return movie;
    }

    async getMovie(id: string){
        let movie = await this.movieRepository.findOne({where: {id}, relations: ["genre"]});
        if(!movie){
            throw new HttpException('Not found', HttpStatus.NOT_FOUND)
        }
        return movie;
    }

    async updateMovie(id: string, data: Partial<MovieDTO>){
        let movie = await this.movieRepository.findOne({where: {id}});
        if(!movie){
            throw new HttpException('Not found', HttpStatus.NOT_FOUND)
        }
        await this.movieRepository.save(data);
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
 