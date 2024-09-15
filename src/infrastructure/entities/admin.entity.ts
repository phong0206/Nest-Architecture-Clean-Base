import { Entity, Column, BeforeInsert } from 'typeorm';
import { BaseEntity } from '../common/base/base.entity';
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcrypt';

@Entity('admins')
export class Admin extends BaseEntity {
  @Column('varchar', { length: 255 })
  name!: string;

  @Column('varchar', { length: 255 })
  @Exclude()
  password!: string;

  @Column('varchar', { length: 255 })
  username!: string;

  @Column('varchar', { length: 255 })
  refresh_token!: string;

  @BeforeInsert()
  async beforeInsert() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
