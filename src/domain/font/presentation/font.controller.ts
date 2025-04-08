import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  Req,
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
import { PaginationFilter } from 'src/common/format/pagination-filter.format';

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
    @Req() req,
    @Query() pagination: PaginationFilter,
    @Res() res: Response,
  ): Promise<any> {
    try {
      pagination.offset = pagination.offset ?? '0';
      pagination.limit = pagination.limit ?? '10';

      const result = await this.fontService.getFontList({
        pagination,
      });

      if (result) {
        res.status(HttpStatus.OK).json({
          status: HttpStatus.OK,
          data: result,
          message: '폰트 목록을 조회했습니다.',
        });
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: '폰트 목록 조회에 실패했습니다.',
        });
      }
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
    @Req() req,
    @Param('font_id') font_id: number,
    @Res() res: Response,
  ): Promise<any> {
    try {
      const result = await this.fontService.getFontDetail({
        font_id: font_id,
      });

      res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        data: result,
        message: '폰트 상세를 조회했습니다.',
      });
    } catch (e) {
      throw e;
    }
  }
}
