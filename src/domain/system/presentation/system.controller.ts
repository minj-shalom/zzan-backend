import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Req,
  Res,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppLogger } from '../../../common/logger/logger.service';
import { Response } from 'express';

@ApiTags('System')
@Controller('system')
export class SystemController {
  constructor(private readonly logger: AppLogger) {
    this.logger.setContext(SystemController.name);
  }

  @Get('/health')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '서버 헬스 체크',
    description: '서버를 헬스 체크합니다.',
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: '서버 헬스 체크를 완료했습니다.',
    type: '',
  })
  async checkServerHealth(@Req() req, @Res() res: Response): Promise<any> {
    try {
      res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        message: '서버 헬스 체크를 완료했습니다.',
      });
    } catch (e) {
      throw e;
    }
  }
}
