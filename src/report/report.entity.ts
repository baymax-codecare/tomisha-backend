import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'reports' })
export class Report {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ length: 500 })
  public message: string;

  @Column({ length: 250 })
  public url: string;
}
