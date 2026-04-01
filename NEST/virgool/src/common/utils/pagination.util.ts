import { PaginationDto } from "../dtos/pagination.dto";

export function paginationSolver(paginationDto: PaginationDto) {
  let { limit = 10, page = 0 } = paginationDto;

  if (!page || page <= 1) page = 0;
  else page = page - 1;

  if (!limit || limit <= 0) limit = 0;
  let skip = page * limit;

  return {
    page: page === 0 ? 1 : page,
    skip,
    limit,
  };
}

export function paginationGenerator(count: number = 0, limit: number = 0, page: number = 0) {
  return {
    totalCount: count,
    limit: +limit,
    page: +page,
    totalPage: Math.ceil(count / limit),
  };
}
