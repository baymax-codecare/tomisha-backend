import { Column } from 'typeorm';

export abstract class FileEntity {
  @Column({ nullable: true, length: 250 })
  public fileName: string;

  @Column({ nullable: true, length: 250 })
  public fileUrl: string;
}
