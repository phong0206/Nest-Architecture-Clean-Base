import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../common/base/base.entity';

@Entity('images')
export class ImageUpload extends BaseEntity {
  @Column('varchar', { length: 255 })
  file_name: string;

  @Column('varchar', { length: 255 })
  path: string;
}
