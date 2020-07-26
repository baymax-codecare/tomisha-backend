import { Column } from 'typeorm';
import { FileEntity } from 'src/shared/entity/file';

export abstract class UserActity extends FileEntity {
  @Column('date')
  public start: Date;

  @Column('date')
  public end: Date;

  @Column({ nullable: true })
  public description: string;
}
