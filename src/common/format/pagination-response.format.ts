import { PaginationTypeProps } from './pagination.format';
import { ApiProperty } from '@nestjs/swagger';

class PaginationResponse implements PaginationTypeProps {
  constructor(offset: number, limit: number, total: number, count: number) {
    this.offset = offset;
    this.limit = limit;
    this.total = total;
    this.count = count;
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

  @ApiProperty({
    description: '전체 데이터 개수',
    type: Number,
    required: false,
  })
  total?: number;

  @ApiProperty({
    description: '필터된 데이터 개수',
    type: Number,
    required: false,
  })
  count?: number;
}

export interface ApiListResponse<T> {
  data: T[];
  pagination: PaginationResponse;
}
