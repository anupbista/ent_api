import {
    Entity, PrimaryGeneratedColumn, DeleteDateColumn, CreateDateColumn, Column, UpdateDateColumn, BeforeInsert
  } from 'typeorm';

  @Entity('userinfo')
  export class UserInfoEntity {
    
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @CreateDateColumn()
    datecreated: Date;
    
    @DeleteDateColumn()
    datedeleted: Date;

    @UpdateDateColumn()
    dateupdated: Date;
    
    @Column('text')
    userid: string;

    @Column('text')
    token: string;
    
  }