import {
	Entity,
	PrimaryGeneratedColumn,
	DeleteDateColumn,
	CreateDateColumn,
	Column,
	UpdateDateColumn,
	ManyToMany,
	JoinTable
} from 'typeorm';
import { CategoryEntity } from '../category/category.entity';

@Entity('game')
export class GameEntity {
	@PrimaryGeneratedColumn('uuid') id: string;

	@CreateDateColumn() datecreated: Date;

	@UpdateDateColumn() dateupdated: Date;

	@DeleteDateColumn() datedeleted: Date;

	@Column('text') name: string;

	@Column({
		type: 'text',
		nullable: true
	})
	imagepath: string;

	@Column('text') description: string;

	@Column('text') releasedate: string;

	@Column('text') downloadlink: string;

	@Column('text') downloadtext: string;

	@Column('decimal') rating: number;

	@ManyToMany((type) => CategoryEntity, (category) => category.name, {
		cascade: true
	})
	@JoinTable()
	category: CategoryEntity[];
}
