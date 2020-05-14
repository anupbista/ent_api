import {
    Entity, PrimaryGeneratedColumn, DeleteDateColumn, CreateDateColumn, Column, UpdateDateColumn, ManyToMany, JoinTable
  } from 'typeorm';
import { GenreEntity } from '../genre/genre.entity';

  @Entity('movie')
  export class MovieEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @CreateDateColumn()
    datecreated: Date;

    @UpdateDateColumn()
    dateupdated: Date;
    
    @DeleteDateColumn()
    datedeleted: Date;
    
    @Column('text')
    name: string;
  
    @Column('text')
    imagepath: string;

    @Column('text')
    description: string;

    @Column('text')
    releasedate: string;

    @Column('text')
    downloadlink: string;

    @Column('text')
    downloadtext: string;

    @Column('text')
    watchlink: string;

    @Column('text')
    watchtext: string;

    @Column('text')
    rating: string;

    @Column('text')
    country: string;

    @ManyToMany( type => GenreEntity)
    @JoinTable()
    genre: GenreEntity[];
    
  }