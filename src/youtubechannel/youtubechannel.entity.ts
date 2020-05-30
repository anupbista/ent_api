import {
	Entity,
	PrimaryGeneratedColumn,
	DeleteDateColumn,
	CreateDateColumn,
	Column,
	UpdateDateColumn
} from 'typeorm';

@Entity('youtubechannel')
export class YouTubeChannelEntity {
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

	@Column({
		type: 'text',
	})
	channellink: string;
}
