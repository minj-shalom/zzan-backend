import { ApiProperty } from '@nestjs/swagger';

export class SearchFontFilter {
  @ApiProperty({
    description: '검색',
    type: String,
    required: false,
  })
  search?: string;
}
