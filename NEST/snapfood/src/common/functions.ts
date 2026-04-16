import { PaginationDto } from "./dto/pagination.dto";

export function isBoolean(value: any) {
  return ["false", false, true, "true"].includes(value);
}

export function toBoolean(value: any) {
  return [true, "true"].includes(value) ? true : [false, "false"].includes(value) ? false : value;
}

export function PaginationSolver(paginationDto: PaginationDto) {
  let { limit, page } = paginationDto;

  if (!page || page <= 1) {
    page = 0;
  } else {
    page = page - 1;
  }

  if (!limit || limit <= 0) {
    limit = 0;
  }

  let skip = page * limit;

  return {
    page: page + 1,
    skip,
    limit,
  };
}

export function paginationGenerator(count: number = 0, limit: number = 0, page: number = 0) {
  return {
    totalCount: count,
    limit: +limit,
    page: page,
    totalPage: Math.ceil(count / limit),
  };
}
