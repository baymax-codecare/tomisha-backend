import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { TagType } from './type/tag-type.enum';

@Entity({ name: 'tag' })
export class Tag {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ length: 500 })
  public title: string;

  @Column('smallint', { default: TagType.HOBBY })
  public type: TagType;
}
