import { InjectRepository } from '@mikro-orm/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { BusinessException } from 'src/common/exceptions/exception/buisness.exception';
import { FontViewLog } from '../domain/invitation-view-log.entity';
import { FontViewLogCustomRepository } from '../repository/invitation-view-log.custom.repository';
import { FontService } from 'src/domain/font/application/font.service';
import { FontExceptionCode } from 'src/common/exceptions/error-codes/font.exception.codes';

@Injectable()
export class LogService {
  constructor(
    @Inject(FontService)
    private fontService: FontService,
    @InjectRepository(FontViewLog)
    private readonly fontViewLogCustomRepository: FontViewLogCustomRepository,
  ) {}

  /**
   * @title createFontViewLog
   * @description 폰트 조회 로그 생성
   * @return 성공 여부(boolean)
   */
  async createFontViewLog(data: {
    font_id: string;
    ip: string;
    fingerprint: object;
  }) {
    const font = await this.fontService.findFont({
      font_id: Number(data?.font_id),
    });
    const font_id = font?.id;

    if (font_id === undefined) {
      throw new BusinessException(FontExceptionCode.FONT_NOT_FOUND);
    }

    const fontViewLog = new FontViewLog({
      font_id,
      ip: data?.ip,
      fingerprint: data?.fingerprint,
    });

    await this.fontViewLogCustomRepository.insertFontViewLog(fontViewLog);

    return true;
  }
}
