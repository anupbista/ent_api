import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MovieEntity } from './movie.entity';
import { Repository, Like, Raw, MoreThan } from 'typeorm';
import { MovieDTO } from './movie.dto';

@Injectable()
export class MovieService {

    constructor(@InjectRepository(MovieEntity) private movieRepository: Repository<MovieEntity>){

    }

    async getAllMovies(page: number, limit: number, search: string = '', genre: string = '', country :string = ''){
        const pageLimit = limit || 20
        const currentPage = page || 1
        // return await this.movieRepository.find({  where: [
        //     { name: Raw(alias => `${alias} ILIKE '%${search}%'`) }
        // ], order: {
        //     datecreated: "DESC"
        // }, relations: ["genre"], take: pageLimit, skip: pageLimit * (currentPage - 1) });

        const [result, total] = await this.movieRepository.createQueryBuilder("MovieEntity")
        .leftJoinAndSelect("MovieEntity.genre", "GenreEntity")
        .where(search != '' ? "MovieEntity.name ILIKE :name" : '1=1', { name: '%' + search + '%' })
        .andWhere(country != '' ? "MovieEntity.country ILIKE :country" : '1=1', { country: '%' + country + '%' })
        .andWhere( genre != '' ? "GenreEntity.id = :gid" : '1=1', { gid: genre })
        .orderBy("MovieEntity.datecreated", "DESC")
        .limit(pageLimit)
        .offset(pageLimit * (currentPage - 1))
        .getManyAndCount();
        return {
            data: result,
            count: total
        }
    }

    async getLastestMovies(page: number, limit: number){
        const pageLimit = limit || 20
        const currentPage = page || 1
        const [result, total] =  await this.movieRepository.findAndCount({ order: {
            releasedate: "DESC"
        }, relations: ["genre"], take: pageLimit, skip: pageLimit * (currentPage - 1) });
        return {
            data: result,
            count: total
        }
    }

    async getPopularMovies(page: number, limit: number){
        const pageLimit = limit || 20
        const currentPage = page || 1
        const [result, total] =  await this.movieRepository.find({ order: {
            rating: "DESC",
            releasedate: "DESC"
        }, relations: ["genre"], take: pageLimit, skip: pageLimit * (currentPage - 1) });
        return {
            data: result,
            count: total
        }
    }

    async getUpcomingMovies(page: number, limit: number){
        const pageLimit = limit || 20
        const currentPage = page || 1
        const [result, total] =  await this.movieRepository.find({ where: [{
            releasedate: MoreThan(new Date())
        }], relations: ["genre"], take: pageLimit, skip: pageLimit * (currentPage - 1) });
        return {
            data: result,
            count: total
        }
    }

    async getTopRatedMovies(page: number, limit: number){
        const pageLimit = limit || 20
        const currentPage = page || 1
        const [result, total] =  await this.movieRepository.find({ order: {
            rating: "DESC",
        }, relations: ["genre"], take: pageLimit, skip: pageLimit * (currentPage - 1) });
        return {
            data: result,
            count: total
        }
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

    async getMovieDashboard(){
        const { count } = await this.movieRepository.createQueryBuilder('movie').select('COUNT(*)', 'count').getRawOne()
        const movies =  await this.movieRepository.find({ order: {
            datecreated: "DESC"
        }, take: 5, skip: 0 });
        return {
            movies: movies,
            count: count
        }
       
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
 