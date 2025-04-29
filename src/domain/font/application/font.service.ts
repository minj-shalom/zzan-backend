import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/postgresql';
import { Font } from '../domain/font.entity';
import { FontCustomRepository } from '../repository/font.custom.repository';
import { PaginationFilter } from 'src/common/format/pagination.format';
import { BusinessException } from 'src/common/exceptions/exception/buisness.exception';
import { FontExceptionCode } from 'src/common/exceptions/error-codes/font.exception.codes';
import { GetFontListFilterDto } from '../presentation/dto/request-dtos/get-font-list-filter.dto';
import { SearchFontFilterDto } from '../presentation/dto/request-dtos/search-font-filter.dto';
import { ApiListResponse } from 'src/common/format/pagination-response.format';
import { GetFontListDto } from '../presentation/dto/response-dtos/get-font-list.dto';
import { GetFontDetailDto } from '../presentation/dto/response-dtos/get-font-detail.dto';

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
   * @return ApiListResponse<GetFontListDto>
   */
  async getFontList(data: {
    pagination: PaginationFilter;
    filter: GetFontListFilterDto;
  }): Promise<ApiListResponse<GetFontListDto>> {
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
   * @return GetFontDetailDto
   */
  async getFontDetail(data: { font_id: number }): Promise<GetFontDetailDto> {
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
   * @return ApiListResponse<GetFontListDto>
   */
  async searchFont(data: {
    pagination: PaginationFilter;
    filter: SearchFontFilterDto;
  }): Promise<ApiListResponse<GetFontListDto>> {
    try {
      // 폰트 검색
      const result = await this.fontCustomRepository.searchFont(data);

      return result;
    } catch (e) {
      throw e;
    }
  }
}
