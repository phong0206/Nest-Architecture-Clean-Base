import { Entity, Column, BeforeInsert } from 'typeorm';
import { BaseEntity } from '../common/base/base.entity';
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import { IsEmail } from 'class-validator';

@Entity('admins')
export class Admin extends BaseEntity {
  @Column('varchar', { length: 255 })
  name!: string;

  @Column('varchar', { length: 255 })
  @Exclude()
  password!: string;

  @IsEmail()
  @Column('varchar', { length: 255 })
  email!: string;

  @Column('varchar', { length: 255, nullable: true })
  refresh_token: string;

  @Column('varchar', { length: 255, nullable: true })
  access_token: string;

  @BeforeInsert()
  async beforeInsert() {
    this.password = await bcrypt.hash(this.password, 10);
    this.email = this.email.toLowerCase();
  }
}
