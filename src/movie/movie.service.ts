import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MovieEntity } from './movie.entity';
import { Repository, Like, Raw, MoreThan } from 'typeorm';
import { MovieDTO } from './movie.dto';
import { Workbook } from 'exceljs';
import { UserService } from '../user/user.service';
import * as moment from 'moment';
import * as fs from 'fs';

@Injectable()
export class MovieService {
	constructor(
		@InjectRepository(MovieEntity) private movieRepository: Repository<MovieEntity>,
		private readonly userService: UserService
	) {}

	async getAllMovies(page: number, limit: number, search: string = '', genre: string = '', country: string = '') {
		const pageLimit = limit || 20;
		const currentPage = page || 1;
		// return await this.movieRepository.find({  where: [
		//     { name: Raw(alias => `${alias} ILIKE '%${search}%'`) }
		// ], order: {
		//     datecreated: "DESC"
		// }, relations: ["genre"], take: pageLimit, skip: pageLimit * (currentPage - 1) });

		const [ result, total ] = await this.movieRepository
			.createQueryBuilder('MovieEntity')
			.leftJoinAndSelect('MovieEntity.genre', 'GenreEntity')
			.where(search != '' ? 'MovieEntity.name ILIKE :name' : '1=1', { name: '%' + search + '%' })
			.andWhere(country != '' ? 'MovieEntity.country ILIKE :country' : '1=1', { country: '%' + country + '%' })
			.andWhere(genre != '' ? 'GenreEntity.id = :gid' : '1=1', { gid: genre })
			.orderBy('MovieEntity.datecreated', 'DESC')
			.limit(pageLimit)
			.offset(pageLimit * (currentPage - 1))
			.getManyAndCount();
		return {
			data: result,
			count: total
		};
	}

	async getReport(page: number, limit: number, userid: string) {
		const pageLimit = limit || 20;
		const currentPage = page || 1;

		let user = await this.userService.getUser(userid);
		let movies = await this.movieRepository.find({
			order: {
				datecreated: 'DESC'
			},
			relations: [ 'genre' ],
			take: pageLimit,
			skip: pageLimit * (currentPage - 1)
		});

		let workbook = new Workbook();
		(workbook.creator = user.lastname), user.firstname;
		(workbook.lastModifiedBy = user.lastname), user.firstname;
		workbook.created = new Date();
		workbook.modified = new Date();
		workbook.lastPrinted = new Date();
		workbook.properties.date1904 = true;

		workbook.views = [
			{
				x: 0,
				y: 0,
				width: 10000,
				height: 20000,
				firstSheet: 0,
				activeTab: 1,
				visibility: 'visible'
			}
		];
		let worksheet = workbook.addWorksheet('Movies');
		worksheet.columns = [
			{ header: 'Id', key: 'id', width: 10 },
			{ header: 'Name', key: 'name', width: 32 },
			{ header: 'Description', key: 'description', width: 32 },
			{ header: 'Release date', key: 'releasedate', width: 32 },
			{ header: 'Download', key: 'download', width: 32 },
			{ header: 'Watch', key: 'watch', width: 32 },
			{ header: 'Rating', key: 'rating', width: 32 },
			{ header: 'Country', key: 'country', width: 32 },
			{ header: 'Genre', key: 'genre', width: 32 }
		];

		movies.forEach((movie, index) => {
			worksheet.addRow({
				id: index,
				name: movie.name,
				description: movie.description,
				releasedate: movie.releasedate,
				download: movie.downloadlink,
				watch: movie.watchlink,
				rating: movie.rating,
				country: movie.country,
				genre: movie.genre[0].name
			});
		});
		if (!fs.existsSync('reports')) {
			fs.mkdirSync('reports');
		}
		let filename = `reports/movies_${moment(new Date()).format('MMDDYYYYHHmmss')}.xlsx;`;
		await workbook.xlsx.writeFile(filename);
		let stream: fs.ReadStream = fs.createReadStream(filename);
		stream.on('close', () => {
			fs.unlink(filename, (error) => {
				if (error) {
					throw error;
				}
			});
		});
		return stream;
	}

	async getLastestMovies(page: number, limit: number) {
		const pageLimit = limit || 20;
		const currentPage = page || 1;
		const [ result, total ] = await this.movieRepository.findAndCount({
			order: {
				releasedate: 'DESC'
			},
			relations: [ 'genre' ],
			take: pageLimit,
			skip: pageLimit * (currentPage - 1)
		});
		return {
			data: result,
			count: total
		};
	}

	async getPopularMovies(page: number, limit: number) {
		const pageLimit = limit || 20;
		const currentPage = page || 1;
		const [ result, total ] = await this.movieRepository.findAndCount({
			order: {
				rating: 'DESC',
				releasedate: 'DESC'
			},
			relations: [ 'genre' ],
			take: pageLimit,
			skip: pageLimit * (currentPage - 1)
		});
		return {
			data: result,
			count: total
		};
	}

	async getUpcomingMovies(page: number, limit: number) {
		const pageLimit = limit || 20;
		const currentPage = page || 1;
		const [ result, total ] = await this.movieRepository.findAndCount({
			where: [
				{
					releasedate: MoreThan(new Date())
				}
			],
			relations: [ 'genre' ],
			take: pageLimit,
			skip: pageLimit * (currentPage - 1)
		});
		return {
			data: result,
			count: total
		};
	}

	async getTopRatedMovies(page: number, limit: number) {
		const pageLimit = limit || 20;
		const currentPage = page || 1;
		const [ result, total ] = await this.movieRepository.findAndCount({
			order: {
				rating: 'DESC'
			},
			relations: [ 'genre' ],
			take: pageLimit,
			skip: pageLimit * (currentPage - 1)
		});
		return {
			data: result,
			count: total
		};
	}

	async saveMovie(data: MovieDTO) {
		const movie = await this.movieRepository.create(data);
		await this.movieRepository.save(movie);
		return movie;
	}

	async getMovie(id: string) {
		let movie = await this.movieRepository.findOne({ where: { id }, relations: [ 'genre' ] });
		if (!movie) {
			throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
		}
		return movie;
	}

	async getMovieDashboard() {
		const { count } = await this.movieRepository
			.createQueryBuilder('movie')
			.select('COUNT(*)', 'count')
			.getRawOne();
		const movies = await this.movieRepository.find({
			order: {
				datecreated: 'DESC'
			},
			take: 5,
			skip: 0
		});
		return {
			movies: movies,
			count: count
		};
	}

	async updateMovie(id: string, data: Partial<MovieDTO>) {
		let movie = await this.movieRepository.findOne({ where: { id } });
		if (!movie) {
			throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
		}
		await this.movieRepository.save({ ...data, id: id });
		return this.movieRepository.findOne({ where: { id }, relations: [ 'genre' ] });
	}

	async deleteMovie(id: string) {
		let ids = id.split(',');
		// let movie = await this.movieRepository.findOne({where: {id}});
		// if(!movie){
		//     throw new HttpException('Not found', HttpStatus.NOT_FOUND)
		// }
		await this.movieRepository.delete(ids);
		return { deleted: true };
	}
}
