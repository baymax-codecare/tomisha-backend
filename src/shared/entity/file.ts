import { Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from 'src/user/user.entity';

export abstract class FileEntity {
  @Column('uuid', { nullable: true })
  public userId: string;

  @Column({ nullable: true, length: 250 })
  public fileName: string;

  @Column({ nullable: true, length: 250 })
  public fileUrl: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  public user: User;
}
