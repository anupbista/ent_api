import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GameEntity } from './game.entity';
import { Repository, Like, Raw, MoreThan } from 'typeorm';
import { GameDTO } from './game.dto';

@Injectable()
export class GameService {

    constructor(@InjectRepository(GameEntity) private gameRepository: Repository<GameEntity>){

    }

    async getAllGames(page: number, limit: number, search: string = '', category: string = ''){
        const pageLimit = limit || 20
        const currentPage = page || 1
        // return await this.gameRepository.find({  where: [
        //     { name: Raw(alias => `${alias} ILIKE '%${search}%'`) }
        // ], order: {
        //     datecreated: "DESC"
        // }, relations: ["category"], take: pageLimit, skip: pageLimit * (currentPage - 1) });

        const [result, total] = await this.gameRepository.createQueryBuilder("GameEntity")
        .leftJoinAndSelect("GameEntity.category", "GenreEntity")
        .where(search != '' ? "GameEntity.name ILIKE :name" : '1=1', { name: '%' + search + '%' })
        .andWhere( category != '' ? "GenreEntity.id = :gid" : '1=1', { gid: category })
        .orderBy("GameEntity.datecreated", "DESC")
        .limit(pageLimit)
        .offset(pageLimit * (currentPage - 1))
        .getManyAndCount();
        return {
            data: result,
            count: total
        }
    }

    async getLastestGames(page: number, limit: number){
        const pageLimit = limit || 20
        const currentPage = page || 1
        const [result, total] =  await this.gameRepository.findAndCount({ order: {
            releasedate: "DESC"
        }, relations: ["category"], take: pageLimit, skip: pageLimit * (currentPage - 1) });
        return {
            data: result,
            count: total
        }
    }

    async getPopularGames(page: number, limit: number){
        const pageLimit = limit || 20
        const currentPage = page || 1
        const [result, total] =  await this.gameRepository.findAndCount({ order: {
            rating: "DESC",
            releasedate: "DESC"
        }, relations: ["category"], take: pageLimit, skip: pageLimit * (currentPage - 1) });
        return {
            data: result,
            count: total
        }
    }

    async getUpcomingGames(page: number, limit: number){
        const pageLimit = limit || 20
        const currentPage = page || 1
        const [result, total] =  await this.gameRepository.findAndCount({ where: [{
            releasedate: MoreThan(new Date())
        }], relations: ["category"], take: pageLimit, skip: pageLimit * (currentPage - 1) });
        return {
            data: result,
            count: total
        }
    }

    async getTopRatedGames(page: number, limit: number){
        const pageLimit = limit || 20
        const currentPage = page || 1
        const [result, total] =  await this.gameRepository.findAndCount({ order: {
            rating: "DESC",
        }, relations: ["category"], take: pageLimit, skip: pageLimit * (currentPage - 1) });
        return {
            data: result,
            count: total
        }
    }

    async saveGame(data: GameDTO){
        const game = await this.gameRepository.create(data);
        await this.gameRepository.save(game);
        return game;
    }

    async getGame(id: string){
        let game = await this.gameRepository.findOne({where: {id}, relations: ["category"]});
        if(!game){
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND)
        }
        return game;
    }

    async getGameDashboard(){
        const { count } = await this.gameRepository.createQueryBuilder('game').select('COUNT(*)', 'count').getRawOne()
        const games =  await this.gameRepository.find({ order: {
            datecreated: "DESC"
        }, take: 5, skip: 0 });
        return {
            games: games,
            count: count
        }
       
    }

    async updateGame(id: string, data: Partial<GameDTO>){
        let game = await this.gameRepository.findOne({where: {id}});
        if(!game){
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND)
        }
        await this.gameRepository.save({...data, id: id})
        return this.gameRepository.findOne({where: {id}, relations: ["category"]})
    }

    async deleteGame(id: string){
        let ids = id.split(',');
        // let game = await this.gameRepository.findOne({where: {id}});
        // if(!game){
        //     throw new HttpException('Not found', HttpStatus.NOT_FOUND)
        // }
        await this.gameRepository.delete(ids);
        return { deleted: true };
    }

}
 