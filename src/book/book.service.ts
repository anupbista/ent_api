import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookEntity } from './book.entity';
import { BookDTO } from './book.dto';

@Injectable()
export class BookService {

    constructor(@InjectRepository(BookEntity) private bookRepository: Repository<BookEntity>){

    }

    async getAllBooks(){
        return await this.bookRepository.find();
    }

    async saveBook(data: BookDTO){
        const book = await this.bookRepository.create(data);
        await this.bookRepository.save(book);
        return book;
    }

    async getBook(id: string){
        let book = await this.bookRepository.findOne({where: {id}});
        if(!book){
            throw new HttpException('Not found', HttpStatus.NOT_FOUND)
        }
        return book;
    }

    async updateBook(id: string, data: Partial<BookDTO>){
        let book = await this.bookRepository.findOne({where: {id}});
        if(!book){
            throw new HttpException('Not found', HttpStatus.NOT_FOUND)
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
 