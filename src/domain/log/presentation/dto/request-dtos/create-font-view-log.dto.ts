import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject } from 'class-validator';

export class CreateFontViewLogDto {
  @IsObject()
  @IsNotEmpty()
  @ApiProperty({ description: '핑거프린트' })
  fingerprint: object;
}
