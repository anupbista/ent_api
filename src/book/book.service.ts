import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Raw, MoreThan } from 'typeorm';
import { BookEntity } from './book.entity';
import { BookDTO } from './book.dto';
import { Workbook } from 'exceljs';
import { UserService } from '../user/user.service';
import * as moment from 'moment';
import * as fs from 'fs';

@Injectable()
export class BookService {

    constructor(@InjectRepository(BookEntity) private bookRepository: Repository<BookEntity>, private readonly userService: UserService){

    }

    async getAllBooks(page: number, limit: number, search: string = ''){
        const pageLimit = limit || 20
        const currentPage = page || 1
        const [result, total] = await this.bookRepository.findAndCount({ where: [
            { name: Raw(alias => `${alias} ILIKE '%${search}%'`) }
        ], order: {
            datecreated: "DESC"
        }, take: pageLimit, skip: pageLimit * (currentPage - 1) });
        return {
            data: result,
            count: total
        }
    }

    async getReport(page: number, limit: number, userid: string) {
		const pageLimit = limit || 20;
		const currentPage = page || 1;

		let user = await this.userService.getUser(userid);
		let books = await this.bookRepository.find({
			order: {
				datecreated: 'DESC'
			},
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
		let worksheet = workbook.addWorksheet('Books');
		worksheet.columns = [
			{ header: 'Id', key: 'id', width: 10 },
			{ header: 'Name', key: 'name', width: 32 },
			{ header: 'Description', key: 'description', width: 32 },
			{ header: 'Release date', key: 'releasedate', width: 32 },
			{ header: 'Download', key: 'download', width: 32 },
			{ header: 'Read', key: 'read', width: 32 },
			{ header: 'Rating', key: 'rating', width: 32 },
			{ header: 'Author', key: 'author', width: 32 },
			{ header: 'Publisher', key: 'publisher', width: 32 }
		];

		books.forEach((book, index) => {
			worksheet.addRow({
				id: index,
				name: book.name,
				description: book.description,
				releasedate: book.releasedate,
				download: book.downloadlink,
				read: book.readlink,
                rating: book.rating,
                author: book.author,
                publisher: book.publisher
			});
		});
		if (!fs.existsSync('reports')) {
			fs.mkdirSync('reports');
		}
		let filename = `reports/books_${moment(new Date()).format('MMDDYYYYHHmmss')}.xlsx`;
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
    
    async getLastestBooks(page: number, limit: number){
        const pageLimit = limit || 20
        const currentPage = page || 1
        const [result, total] = await this.bookRepository.findAndCount({ order: {
            releasedate: "DESC"
        }, take: pageLimit, skip: pageLimit * (currentPage - 1) });
        return {
            data: result,
            count: total
        }
    }

    async getPopularBooks(page: number, limit: number){
        const pageLimit = limit || 20
        const currentPage = page || 1
        const [result, total] = await this.bookRepository.findAndCount({ order: {
            rating: "DESC",
            releasedate: "DESC"
        }, take: pageLimit, skip: pageLimit * (currentPage - 1) });
        return {
            data: result,
            count: total
        }
    }

    async getUpComingBooks(page: number, limit: number){
        const pageLimit = limit || 20
        const currentPage = page || 1
        const [result, total] = await this.bookRepository.findAndCount({ where: [{
            releasedate: MoreThan(new Date())
        }], take: pageLimit, skip: pageLimit * (currentPage - 1) });
        return {
            data: result,
            count: total
        }
    }

    async getTopRatedBooks(page: number, limit: number){
        const pageLimit = limit || 20
        const currentPage = page || 1
        const [result, total] =  await this.bookRepository.findAndCount({ order: {
            rating: "DESC"
        }, take: pageLimit, skip: pageLimit * (currentPage - 1) });
        return {
            data: result,
            count: total
        }
    }

    async saveBook(data: BookDTO){
        const book = await this.bookRepository.create(data);
        await this.bookRepository.save(book);
        return book;
    }

    async getBook(id: string){
        let book = await this.bookRepository.findOne({where: {id}});
        if(!book){
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND)
        }
        return book;
    }

    async getBookDashboard(){
        const { count } = await this.bookRepository.createQueryBuilder('book').select('COUNT(*)', 'count').getRawOne()
        const books =  await this.bookRepository.find({ order: {
            datecreated: "DESC"
        }, take: 5, skip: 0 });
        return {
            books: books,
            count: count
        }
    }

    async updateBook(id: string, data: Partial<BookDTO>){
        let book = await this.bookRepository.findOne({where: {id}});
        if(!book){
            throw new HttpException('Not Found', HttpStatus.NOT_FOUND)
        }
        await this.bookRepository.update({id}, data);
        return this.bookRepository.findOne({where: {id}})
    }

    async deleteBook(id: string){
        let ids = id.split(',');
        // let book = await this.bookRepository.findOne({where: {id}});
        // if(!book){
        //     throw new HttpException('Not found', HttpStatus.NOT_FOUND)
        // }
        await this.bookRepository.delete(ids);
        return { deleted: true };
    }

}
 