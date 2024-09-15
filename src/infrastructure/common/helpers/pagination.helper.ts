import { PaginationDto } from '../base/dto.base';
import { Like } from 'typeorm';

export function paginationHelper<T>(
  array: T[],
  paginationDto: PaginationDto,
): IPaginationResponse<T> {
  const limit = +(paginationDto.limit || 10);
  const page = +(paginationDto.page || 1);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  return {
    data: array.slice(startIndex, endIndex),
    pagination: {
      limit,
      page,
      total: array.length,
    },
  };
}

export function applyLikeFilter(
  where: Record<string, any>,
): Record<string, any> {
  if (!where) return {};
  return Object.keys(where).reduce((acc, key) => {
    if (/id/.test(key) && key !== 'staff_id') {
      acc[key] = where[key];
    } else {
      acc[key] = Like(`%${where[key]}%`);
    }
    return acc;
  }, {});
}
