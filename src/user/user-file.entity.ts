import { Entity, PrimaryGeneratedColumn } from 'typeorm';
import { FileEntity } from 'src/shared/entity/file';

@Entity({ name: 'user-files' })
export class UserFile extends FileEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;
}