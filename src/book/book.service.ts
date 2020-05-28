import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Raw, MoreThan } from 'typeorm';
import { BookEntity } from './book.entity';
import { BookDTO } from './book.dto';

@Injectable()
export class BookService {

    constructor(@InjectRepository(BookEntity) private bookRepository: Repository<BookEntity>){

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
 