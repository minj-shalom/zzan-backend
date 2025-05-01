import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AppLogger } from '../../../common/logger/logger.service';
import { Response } from 'express';
import { LogService } from '../application/log.service';
import { FORWARDED_FOR_TOKEN_HEADER } from 'src/common/constants/common';
import { CreateFontViewLogDto } from './dto/request-dtos/create-font-view-log.dto';

@ApiTags('Log')
@Controller('log')
export class LogController {
  constructor(
    private readonly logger: AppLogger,
    private readonly logService: LogService,
  ) {
    this.logger.setContext(LogController.name);
  }

  @Post('/font/:font_id')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: '폰트 조회 로그 생성',
    description: '폰트 조회 로그를 생성합니다.',
  })
  @ApiCreatedResponse({
    status: HttpStatus.CREATED,
    description: '폰트 조회 로그를 생성했습니다.',
    type: '',
  })
  @ApiParam({
    name: 'font_id',
    description: '생성할 폰트 id',
    required: true,
    type: String,
  })
  async createFontViewLog(
    @Req() req,
    @Param('font_id') font_id: string,
    @Body() createFontViewLogDto: CreateFontViewLogDto,
    @Res() res: Response,
  ): Promise<any> {
    try {
      const result = await this.logService.createFontViewLog({
        font_id,
        ip: req.header(FORWARDED_FOR_TOKEN_HEADER) || req.ip,
        fingerprint: createFontViewLogDto?.fingerprint,
      });

      if (result) {
        res.status(HttpStatus.CREATED).json({
          status: HttpStatus.CREATED,
          message: '폰트 조회 로그를 생성했습니다.',
        });
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: '폰트 조회 로그 생성에 실패했습니다.',
        });
      }
    } catch (e) {
      throw e;
    }
  }
}
