import { ApiProperty } from '@nestjs/swagger';
import { FontTypeEnum } from 'src/domain/font/domain/status/FontTypeEnum';

export class GetFontListDto {
  @ApiProperty({
    description: 'ID',
    type: Number,
    required: true,
  })
  id!: number;

  @ApiProperty({
    description: '이름',
    type: String,
    required: true,
  })
  title: string;

  @ApiProperty({
    description: '제작',
    type: String,
    required: true,
  })
  author: string;

  @ApiProperty({
    description: '타입',
    type: String,
    required: true,
  })
  type: FontTypeEnum;

  @ApiProperty({
    description: '굵기',
    type: Number,
    required: true,
  })
  font_weight: number;

  @ApiProperty({
    description: '웹폰트',
    type: String,
    required: true,
  })
  font_face: string;

  @ApiProperty({
    description: '다운로드 링크',
    type: String,
    required: true,
  })
  download_url: string;

  @ApiProperty({
    description: '라이센스',
    type: Object,
    required: true,
  })
  license: object;

  @ApiProperty({
    description: '조회수',
    type: Number,
    required: true,
  })
  view: number;

  @ApiProperty({
    description: '생성 일시',
    type: String,
    required: true,
  })
  created_at: Date;

  @ApiProperty({
    description: '수정 일시',
    type: String,
    required: false,
  })
  updated_at?: Date;
}
