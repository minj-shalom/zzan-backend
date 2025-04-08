import { HttpStatus } from '@nestjs/common';
import { Enum, EnumType } from 'ts-jenum';

@Enum('code')
export class FontExceptionCode extends EnumType<FontExceptionCode>() {
  static readonly FONT_NOT_FOUND = new FontExceptionCode(
    HttpStatus.NOT_FOUND,
    'FEC001',
    'FONT_NOT_FOUND',
    '해당 폰트를 찾을 수 없습니다.',
  );

  private constructor(
    readonly httpStatus: number,
    readonly code: string,
    readonly errorString: string,
    readonly message: string,
  ) {
    super();
  }
}
