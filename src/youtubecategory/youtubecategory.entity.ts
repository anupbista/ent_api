import {
    Entity, PrimaryGeneratedColumn, DeleteDateColumn, CreateDateColumn, Column, UpdateDateColumn, ManyToOne
  } from 'typeorm';

  @Entity('youtubecategory')
  export class YouTubeCategoryEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @CreateDateColumn()
    datecreated: Date;
    
    @DeleteDateColumn()
    datedeleted: Date;

    @UpdateDateColumn()
    dateupdated: Date;
    
    @Column('text')
    name: string;
    
  }