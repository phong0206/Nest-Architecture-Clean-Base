/* eslint-disable @typescript-eslint/ban-ts-comment */
import { BaseEntity } from './base.entity';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { extend } from 'lodash';
import {
  DeepPartial,
  DeleteResult,
  EntityManager,
  FindManyOptions,
  FindOptionsWhere,
  Repository,
  UpdateResult,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { AbstractBaseService } from './interface.base';

/**
 * BaseService is a class including methods to CRUD db. it is extended by another class.
 * @template T data type of record
 */
export abstract class BaseService<
  T extends BaseEntity,
> extends AbstractBaseService<T> {
  abstract notFoundMessage: string;

  constructor(private readonly repository: Repository<T>) {
    super();
  }

  create(data: DeepPartial<T>): Promise<T> {
    return this.repository.create(data).save();
  }

  async createMany(datas: DeepPartial<T>[]): Promise<T[]> {
    const entities: T[] = [];
    for (const data of datas) {
      const entity = this.repository.create(data);
      entities.push(entity);
    }
    return this.repository.save(entities);
  }

  async save(entity: T): Promise<T> {
    return this.repository.save(entity);
  }

  async saveMany(entities: T[]): Promise<T[]> {
    return this.repository.save(entities);
  }

  getOne(options: FindOptions<T>): Promise<T | null> {
    const { relations, loadEagerRelations, order, withDeleted, select, where } =
      options;
    return this.repository.findOne({
      where,
      relations,
      loadEagerRelations,
      order,
      withDeleted,
      select,
    });
  }

  async getOneOrFail(options: FindOrFailOptions<T>): Promise<T> {
    const errorMessage = options?.errorMessage || this.notFoundMessage;
    const where = options.where;
    const entity = await this.getOne({ ...options, where });
    if (!entity) throw new NotFoundException(errorMessage);
    return entity;
  }

  getOneById(id: number, options?: Partial<FindOptions<T>>): Promise<T | null> {
    const where = { id } as FindOptionsWhere<T>;
    return this.getOne({ ...options, where });
  }

  async getOneByIdOrFail(
    id: number,
    options?: Partial<FindOrFailOptions<T>>,
  ): Promise<T> {
    const errorMessage = options?.errorMessage || this.notFoundMessage;
    const entity = await this.getOneById(id, options);
    if (!entity) throw new NotFoundException(errorMessage);
    return entity;
  }

  async getOneOrCreate(
    options: FindOptions<T>,
    data?: DeepPartial<T>,
  ): Promise<T> {
    const entity = await this.getOne(options);
    if (!entity) {
      if (!data) {
        throw new InternalServerErrorException('Missing creation data');
      }
      return this.create(data);
    }
    return entity;
  }

  getAll(options: Partial<FindManyOptions<T>>): Promise<T[]> {
    const { relations, order, loadEagerRelations, withDeleted, select, take } =
      options;
    const where = options.where;
    return this.repository.find({
      where,
      relations,
      order,
      loadEagerRelations,
      withDeleted,
      select,
      take,
    });
  }

  async getAllPaginated(
    options: FindPaginatedOptions<T>,
  ): Promise<IPaginationResponse<T>> {
    const {
      limit,
      page = 1,
      where = { ...options.where, ...options.filter },
      select,
      withDeleted,
      loadEagerRelations,
      order,
      relations,
    } = options;
    const take = limit === undefined || limit <= 0 ? undefined : limit;
    const skip = take === undefined ? undefined : take * (+page - 1);
    const findAndCountOptions = {
      where: where,
      order,
      relations,
      take,
      skip,
      loadEagerRelations,
      withDeleted,
      select,
    };
    const [data, total] =
      await this.repository.findAndCount(findAndCountOptions);

    return {
      data,
      pagination: {
        limit: limit === -1 ? total : limit,
        page: limit === -1 ? 1 : page,
        total,
      },
    };
  }

  async update(
    options: FindOrFailOptions<T>,
    data: QueryDeepPartialEntity<T>,
  ): Promise<T> {
    const entity = await this.getOneOrFail(options);
    const newEntity = extend<T>(entity, data);
    return newEntity.save();
  }

  async updateById(
    id: number,
    data: QueryDeepPartialEntity<T>,
    options?: Partial<FindOrFailOptions<T>>,
  ): Promise<T> {
    const entity = await this.getOneByIdOrFail(id, options);
    const newEntity = extend<T>(entity, data);
    return newEntity.save();
  }

  async remove(options: FindOrFailOptions<T>): Promise<T> {
    const entity = await this.getOneOrFail(options);
    return this.repository.remove(entity);
  }

  async deleteMany(
    options:
      | string
      | string[]
      | number
      | number[]
      | Date
      | Date[]
      | FindOptionsWhere<T>,
  ) {
    return this.repository.delete(options);
  }

  async removeById(
    id: number,
    options?: Partial<FindOrFailOptions<T>>,
  ): Promise<T> {
    const entity = await this.getOneByIdOrFail(id, options);
    return this.repository.remove(entity);
  }

  removeAll(): Promise<DeleteResult> {
    return this.repository.delete({});
  }

  async softRemove(options: FindOrFailOptions<T>): Promise<T> {
    const entity = await this.getOneOrFail(options);
    return this.repository.softRemove(entity);
  }

  async softRemoveMany(options: FindOrFailOptions<T>): Promise<T[]> {
    const entities = await this.getAll(options);
    return this.repository.softRemove(entities);
  }

  async softRemoveById(
    id: number,
    options?: Partial<FindOrFailOptions<T>>,
  ): Promise<T> {
    const entity = await this.getOneByIdOrFail(id, options);
    return this.repository.softRemove(entity);
  }

  softRemoveAll(): Promise<DeleteResult> {
    return this.repository.softDelete({});
  }

  count(options: Partial<FindOptions<T>>) {
    return this.repository.count(options);
  }

  getQueryBuilder(alias?: string) {
    return this.repository.createQueryBuilder(alias);
  }

  increment(
    where: FindOptionsWhere<T>,
    field: string,
    value: number,
  ): Promise<UpdateResult> {
    return this.repository.increment(where, field, value);
  }

  decrement(
    where: FindOptionsWhere<T>,
    field: string,
    value: number,
  ): Promise<UpdateResult> {
    return this.repository.decrement(where, field, value);
  }

  query<K = any>(queryString: string, parameters?: any[]): Promise<K> {
    return this.repository.query(queryString, parameters);
  }

  transaction<T>(
    runInTransaction: (entityManager: EntityManager) => Promise<T>,
  ) {
    return this.repository.manager.transaction(runInTransaction);
  }

  existsBy(
    where: FindOptionsWhere<T> | FindOptionsWhere<T>[],
  ): Promise<boolean> {
    return this.repository.existsBy(where);
  }
}
