import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  Res,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AppLogger } from '../../../common/logger/logger.service';
import { FontService } from '../application/font.service';
import { Response } from 'express';
import {
  Pagination,
  PaginationFilter,
} from 'src/common/format/pagination.format';
import { GetFontListFilterDto } from './dto/request-dtos/get-font-list-filter.dto';
import { SearchFontFilterDto } from './dto/request-dtos/search-font-filter.dto';

@ApiTags('Font')
@Controller('font')
export class FontController {
  constructor(
    private readonly logger: AppLogger,
    private readonly fontService: FontService,
  ) {
    this.logger.setContext(FontController.name);
  }

  @Get('')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '폰트 목록 조회',
    description: '폰트 목록을 조회합니다.',
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: '폰트 목록을 조회했습니다.',
    type: '',
  })
  async getFontList(
    @Pagination() pagination: PaginationFilter,
    @Query() filter: GetFontListFilterDto,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const result = await this.fontService.getFontList({
        pagination,
        filter: {
          ...filter,
          fontType: filter['fontType[]'],
          license: filter['license[]'],
        },
      });

      return res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        data: result,
        message: '폰트 목록을 조회했습니다.',
      });
    } catch (e) {
      throw e;
    }
  }

  @Get('/search')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '폰트 검색',
    description: '폰트를 검색합니다.',
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: '폰트를 검색했습니다.',
    type: '',
  })
  async searchFont(
    @Pagination() pagination: PaginationFilter,
    @Query() filter: SearchFontFilterDto,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const result = await this.fontService.searchFont({
        pagination,
        filter,
      });

      return res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        data: result,
        message: '폰트를 검색했습니다.',
      });
    } catch (e) {
      throw e;
    }
  }

  @Get('/:font_id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '폰트 상세 조회',
    description: '폰트 상세를 조회합니다.',
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: '폰트 상세를 조회했습니다.',
    type: '',
  })
  @ApiParam({
    name: 'font_id',
    description: '조회할 폰트 id',
    required: true,
    type: String,
  })
  async getFontDetail(
    @Param('font_id') font_id: number,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const result = await this.fontService.getFontDetail({
        font_id: font_id,
      });

      return res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        data: result,
        message: '폰트 상세를 조회했습니다.',
      });
    } catch (e) {
      throw e;
    }
  }
}
