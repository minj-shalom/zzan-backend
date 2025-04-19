import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/postgresql';
import { Font } from '../domain/font.entity';
import { FontCustomRepository } from '../repository/font.custom.repository';
import {
  PaginationFilter,
  PaginationResponse,
} from 'src/common/format/pagination.format';
import { BusinessException } from 'src/common/exceptions/exception/buisness.exception';
import { FontExceptionCode } from 'src/common/exceptions/error-codes/font.exception.codes';
import { GetFontListFilter } from '../presentation/dto/request-dtos/get-font-list-filter.dto';
import { SearchFontFilter } from '../presentation/dto/request-dtos/search-font-filter.dto';

@Injectable()
export class FontService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(Font)
    private readonly fontCustomRepository: FontCustomRepository,
  ) {}

  /**
   * @title getFontList
   * @description 폰트 목록 조회
   * @return Font[]
   */
  async getFontList(data: {
    pagination: PaginationFilter;
    filter: GetFontListFilter;
  }): Promise<{ data: Font[]; pagination: PaginationResponse }> {
    try {
      // 폰트 목록 조회
      const result = await this.fontCustomRepository.getFontList(data);

      return result;
    } catch (e) {
      throw e;
    }
  }

  /**
   * @title getFontDetail
   * @description 폰트 상세 조회
   * @return Font
   */
  async getFontDetail(data: { font_id: number }): Promise<any> {
    try {
      // 폰트 상세 조회
      const result = await this.fontCustomRepository.getFontDetail(data);

      if (!result) {
        throw new BusinessException(FontExceptionCode.FONT_NOT_FOUND);
      }

      return result;
    } catch (e) {
      throw e;
    }
  }

  /**
   * @title searchFont
   * @description 폰트 검색
   * @return Font[]
   */
  async searchFont(data: {
    pagination: PaginationFilter;
    filter: SearchFontFilter;
  }): Promise<{ data: Font[]; pagination: PaginationResponse }> {
    try {
      // 폰트 검색
      const result = await this.fontCustomRepository.searchFont(data);

      return result;
    } catch (e) {
      throw e;
    }
  }
}
