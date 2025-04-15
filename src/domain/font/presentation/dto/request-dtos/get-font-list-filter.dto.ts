import { ApiProperty } from '@nestjs/swagger';
import { FontLicenseEnum } from 'src/domain/font/domain/status/FontLicenseEnum';
import { FontTypeEnum } from 'src/domain/font/domain/status/FontTypeEnum';

export class GetFontListFilter {
  @ApiProperty({
    description: '정렬',
    type: String,
    required: false,
  })
  orderBy?: string;

  @ApiProperty({
    description: '검색',
    type: String,
    required: false,
  })
  search?: string;

  @ApiProperty({
    description: '타입',
    type: String,
    required: false,
    isArray: true,
    enum: [
      FontTypeEnum.SANS_SERIF,
      FontTypeEnum.SERIF,
      FontTypeEnum.HANDWRITING,
      FontTypeEnum.DECORATIVE,
      FontTypeEnum.PIXEL,
      FontTypeEnum.TRADITIONAL_SCRIPT,
      FontTypeEnum.ROUNDED_SANS,
      FontTypeEnum.CALLIGRAPHY_FONT,
      FontTypeEnum.CODING_FONT,
      FontTypeEnum.ENGLISH,
    ],
  })
  fontType?: FontTypeEnum[];

  @ApiProperty({
    description: '굵기',
    type: Number,
    required: false,
  })
  fontWeight?: number;

  @ApiProperty({
    description: '라이센스',
    required: false,
    isArray: true,
    enum: [
      FontLicenseEnum.PRINT,
      FontLicenseEnum.WEBSITE,
      FontLicenseEnum.PACKAGING,
      FontLicenseEnum.VIDEO,
      FontLicenseEnum.EMBEDDING,
      FontLicenseEnum.BI_CI,
      FontLicenseEnum.OFL,
    ],
    type: String,
  })
  license?: FontLicenseEnum[];
}
