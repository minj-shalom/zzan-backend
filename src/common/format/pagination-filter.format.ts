import { ApiProperty } from '@nestjs/swagger';

interface PaginationTypeProps {
  offset?: string;
  limit?: string;
}

export class PaginationFilter implements PaginationTypeProps {
  @ApiProperty({
    description: '조회 시작점(초기값 0)',
    type: String,
    required: false,
  })
  offset?: string = '0';

  @ApiProperty({
    description: '페이지 크기(초기값 10)',
    type: String,
    required: false,
  })
  limit?: string = '10';
}
