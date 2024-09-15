import { BaseEntity } from './base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';
import { FindOptionsOrder, FindOptionsWhere } from 'typeorm';

export class PaginationDto<T = BaseEntity> {
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => +(value || 10))
  @ApiProperty({
    description: 'item per page',
    example: '10',
    type: 'string',
    required: false,
  })
  limit?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => +(value || 10))
  @ApiProperty({
    description: 'current page',
    example: '1',
    type: 'string',
  })
  page?: number;

  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? JSON.parse(value || '{}') : value,
  )
  @ApiProperty({
    description: 'Sort by field',
    example: '{ "created_at": "ASC" }',
    type: 'string',
    required: false,
  })
  order?: FindOptionsOrder<T>;

  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? JSON.parse(value || '{}') : value,
  )
  @ApiProperty({
    description: 'Filter by field',
    example: '{ "name": "string" }',
    type: 'string',
    required: false,
  })
  filter?: FindOptionsWhere<T> | FindOptionsWhere<T>[];

  @IsOptional()
  @ApiProperty({ description: 'search', example: '' })
  search?: string;
}

export class PaginationDetails {
  @ApiProperty({ description: 'Items per page' })
  limit: number;

  @ApiProperty({ description: 'Current page number' })
  page: number;

  @ApiProperty({ description: 'Total number of items' })
  total: number;
}
