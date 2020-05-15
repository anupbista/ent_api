import {
    Entity, PrimaryGeneratedColumn, DeleteDateColumn, CreateDateColumn, Column, UpdateDateColumn, BeforeInsert
  } from 'typeorm';
  import * as bcrypt from 'bcryptjs';

  @Entity('user')
  export class UserEntity {
    
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @CreateDateColumn()
    datecreated: Date;
    
    @DeleteDateColumn()
    datedeleted: Date;

    @UpdateDateColumn()
    dateupdated: Date;
    
    @Column('text')
    firstname: string;

    @Column({
      type: 'text',
      nullable: true,
    })
    middlename: string;

    @Column('text')
    lastname: string;

    @Column('text')
    role: string;

    @Column('text')
    imagepath: string;

    @Column('text')
    email: string;

    @Column({
        type: 'text',
        unique: true,
      })
    username: string;

    @Column({ type: 'text', select: false })
    password: string;

    @BeforeInsert()
    async hashPassword() {
      this.password = await bcrypt.hash(this.password, 10);
    }
    
  }