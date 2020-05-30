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
import { YouTubeCategoryEntity } from '../youtubecategory/youtubecategory.entity';

@Entity('youtubevideo')
export class YouTubeVideoEntity {
	@PrimaryGeneratedColumn('uuid') id: string;

	@CreateDateColumn() datecreated: Date;

	@UpdateDateColumn() dateupdated: Date;

	@DeleteDateColumn() datedeleted: Date;

	@Column('text') name: string;

    @Column('text') watchlink: string;
    
    @Column({ type: 'text', default: 'YouTube' }) watchtext: string;
    
    @Column({
        type: 'text',
        nullable: true
    }) uploadedby: string;
    
	@Column({
        type: 'text',
        nullable: true
    }) uploadedchannel: string;

	@ManyToMany((type) => YouTubeCategoryEntity, (category) => category.name, {
		cascade: true
	})
	@JoinTable()
	category: YouTubeCategoryEntity[];
}
