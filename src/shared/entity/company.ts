import { Column } from 'typeorm';
import { Contact } from './contact';

export abstract class Company extends Contact {
  @Column({ nullable: true, length: 250 })
  public company: string;

  @Column({ nullable: true, length: 250 })
  public businessEmail: string;
}
