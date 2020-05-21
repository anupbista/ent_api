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

@Entity('book')
export class BookEntity {
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

	@Column({
		type: 'text',
		nullable: true
	})
	downloadlink: string;

	@Column({
		type: 'text',
		nullable: true
	})
	downloadtext: string;

	@Column({
		type: 'text',
		nullable: true
	})
	readlink: string;

	@Column({
		type: 'text',
		nullable: true
	})
	readtext: string;

	@Column('text') author: string;

	@Column({
		type: 'text',
		nullable: true
	})
	publisher: string;

	@Column({
		type: 'decimal',
		nullable: true
	})
	rating: number;
}
