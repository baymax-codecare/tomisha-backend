import { EntityTimestamp } from "./timestamp";
import { Column } from 'typeorm';

export abstract class Contact extends EntityTimestamp {
  @Column({ nullable: true, length: 50 })
  public phone: string;

  @Column({ nullable: true, length: 3 })
  public country: string;

  @Column({ nullable: true, length: 250 })
  public street: string;

  @Column({ nullable: true, length: 250 })
  public city: string;

  @Column({ nullable: true, length: 50 })
  public zip: string;
}