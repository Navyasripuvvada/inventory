import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,UseGuards,Req
} from '@nestjs/common';

import {
  ApiBody,
  ApiConsumes,
  ApiTags,ApiBearerAuth,
} from '@nestjs/swagger';

import { FileInterceptor } from '@nestjs/platform-express';
import { UploadsService } from '../uploads/upload.service';
import { JwtAuthGuard } from '../auth/guard/authguard.guard';

@ApiTags('Uploads')
@Controller('uploads')
export class UploadsController {

  constructor(
    private readonly uploadsService: UploadsService,
  ) {}

  @Post()
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseGuards(JwtAuthGuard)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file: Express.Multer.File,@Req() req
  ) {
    return this.uploadsService.uploadFile(req.user.userId,file);
  }
}