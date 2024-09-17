import { BaseEntity } from './base.entity';
import { DeepPartial, DeleteResult, FindOptionsWhere, SelectQueryBuilder, UpdateResult } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

/**
 * @template T data type of record
 */
export abstract class AbstractBaseService<T extends BaseEntity> {
  /**
   * create a record
   * @param data data to create record
   * @returns Promise<T>
   * @example service.create({ name: 'John Doe' })
   */
  abstract create(data: DeepPartial<T>): Promise<T>;
  /**
   * create many records
   * @param data data to create many records
   * @returns Promise<T[]>
   * @example service.createMany([{ name: 'John Doe' }, { name: 'Jane Doe' }])
   */
  abstract createMany(data: DeepPartial<T>[]): Promise<T[]>;

  /**
   * get a record
   * @param options option to get a record
   * @returns Promise<T | null>
   * @example service.getOne({ where: { name: 'John Doe' } })
   */
  abstract getOne(options: FindOptions<T>): Promise<T | null>;
  /**
   * get a record, if not found, return error NotFound
   * @param options option to get record
   * @returns Promise<T>
   * @example service.getOneOrFail({ where: { name: 'John Doe' } })
   */
  abstract getOneOrFail(options: FindOrFailOptions<T>): Promise<T>;

  /**
   * get a record by id
   * @param id Id of record
   * @param options option to get record
   * @returns Promise<T | null>
   * @example service.getOneById('uuid', { where: { name: 'John Doe' } })
   */
  abstract getOneById(id: number, options?: Partial<FindOptions<T>>): Promise<T | null>;
  /**
   * get a record by id, if not found record, return error NotFound
   * @param id Id of record
   * @param options option to get record
   * @returns Promise<T>
   * @example service.getOneByIdOrFail('uuid', { where: { name: 'John Doe' } })
   */
  abstract getOneByIdOrFail(id: number, options?: Partial<FindOrFailOptions<T>>): Promise<T>;

  /**
   * Get all records
   * @param options option to get record
   * @returns Promise<T[]>
   * @example service.getAll({ where: { name: 'John Doe' } })
   */
  abstract getAll(options?: Partial<FindOptions<T>>): Promise<T[]>;
  /**
   * get all record by option filter and pagination
   * @param options option to get record
   * @returns Promise<IPaginationResponse<T>>
   * @example service.getAllPaginated({ where: { name: 'John Doe' }, limit: '10', page: '1' })
   */
  abstract getAllPaginated(options?: FindPaginatedOptions<T>): Promise<IPaginationResponse<T>>;

  /**
   * update a record, if not found record, return error NotFound
   * @param options option to get record
   * @param data Data to update record
   * @returns Promise<T>
   * @example service.update({ where: { name: 'John Doe' } }, { name: 'Jane Doe updated' })
   */
  abstract update(options: FindOrFailOptions<T>, data: QueryDeepPartialEntity<T>): Promise<T>;
  /**
   * update a record by id, if not found record, return error NotFound
   * @param id Id of record
   * @param data data to update record
   * @param options option to get record
   * @returns Promise<T>
   * @example service.updateById('uuid', { name: 'Jane Doe updated' }, { loadEagerRelations: false, errorMessage: 'Not found' } })
   */
  abstract updateById(id: number, data: QueryDeepPartialEntity<T>, options?: Partial<FindOrFailOptions<T>>): Promise<T>;

  /**
   * remove record, if not found record, return error NotFound
   * @param options option to get record
   * @returns Promise<T>
   * @example service.remove({ where: { name: 'John Doe' } })
   */
  abstract remove(options: FindOrFailOptions<T>): Promise<T>;
  /**
   * Xoá một record theo id, if not found record, return error NotFound
   * @param id Id of record
   * @param options option to get record
   * @returns Promise<T>
   * @example service.removeById('uuid', { loadEagerRelations: false, errorMessage: 'Not found' } })
   */
  abstract removeById(id: number, options?: Partial<FindOrFailOptions<T>>): Promise<T>;

  /**
   * remove all record
   * @returns Promise<T>
   * @example service.removeAll()
   */
  abstract removeAll(): Promise<DeleteResult>;

  /**
   * soft remove a record, if not found record, return error NotFound
   * @param options option to get record
   * @returns Promise<T>
   * @example service.softRemove({ where: { name: 'John Doe' } })
   */
  abstract softRemove(options: FindOrFailOptions<T>): Promise<T>;

  /**
   * soft remove multiple records
   * @param options option to get record
   * @returns Promise<T[]>
   * @example service.softRemove({ where: { name: 'John Doe' } })
   */
  abstract softRemoveMany(options: FindOrFailOptions<T>): Promise<T[]>;

  /**
   * soft remove a record by id
   * @param id Id of record
   * @param options option to get record
   * @returns Promise<T>
   * @example service.softRemoveById('uuid', { loadEagerRelations: false, errorMessage: 'Not found' } })
   */
  abstract softRemoveById(id: number, options?: Partial<FindOrFailOptions<T>>): Promise<T>;

  /**
   * soft remove all record
   * @returns Promise<T>
   * @example service.softRemoveAll()
   */
  abstract softRemoveAll(): Promise<DeleteResult>;

  /**
   * count record
   * @param options option to get record
   * @returns Promise<number>
   * @example service.count({ where: { name: 'John Doe' } })
   */
  abstract count(options: Partial<FindOptions<T>>): Promise<number>;

  abstract getQueryBuilder(alias?: string): SelectQueryBuilder<T>;

  /**
   * increment
   * @param where option to get record
   * @param field field to increment
   * @param value value to increment
   * @returns Promise<UpdateResult>
   * @example service.increment({ where: { name: 'John Doe' } }, 'age', 1)
   */
  abstract increment(where: FindOptionsWhere<T>, field: string, value: number): Promise<UpdateResult>;
  /**
   * Decrement
   * @param where option to get record
   * @param field filed to decrement
   * @param value value to decrement
   * @returns Promise<UpdateResult>
   * @example service.decrement({ where: { name: 'John Doe' } }, 'age', 1)
   */
  abstract decrement(where: FindOptionsWhere<T>, field: string, value: number): Promise<UpdateResult>;
  /**
   * Get a record or create new record
   * @param options option to get record
   * @param data data to get record
   * @returns Promise<T>
   * @example service.getOneOrCreate({ where: { name: 'John Doe' } }, { name: 'John Doe' })
   */
  abstract getOneOrCreate(options: FindOptions<T>, data?: DeepPartial<T>): Promise<T>;
}
