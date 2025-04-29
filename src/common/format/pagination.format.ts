import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export interface PaginationTypeProps {
  offset?: number;
  limit?: number;
}

export const Pagination = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const { offset, limit } = request.query;

    return new PaginationFilter(
      isNaN(parseInt(offset)) ? 0 : parseInt(offset),
      isNaN(parseInt(limit)) ? 10 : parseInt(limit),
    );
  },
);

export class PaginationFilter implements PaginationTypeProps {
  constructor(offset: number, limit: number) {
    this.offset = offset;
    this.limit = limit;
  }

  @ApiProperty({
    description: '조회 시작점(초기값 0)',
    type: Number,
    required: false,
  })
  offset?: number;

  @ApiProperty({
    description: '페이지 크기(초기값 10)',
    type: Number,
    required: false,
  })
  limit?: number;
}
