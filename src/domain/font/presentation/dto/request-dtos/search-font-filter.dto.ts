import { ApiProperty } from '@nestjs/swagger';

export class SearchFontFilterDto {
  @ApiProperty({
    description: '검색',
    type: String,
    required: false,
  })
  search?: string;
}
