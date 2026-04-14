import {
  BadRequestException,
  Controller,
  Param,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { memoryStorage } from 'multer';
import { DriveService } from './drive.service';

const MAX_FILES = 20;
const MAX_SIZE_BYTES = 20 * 1024 * 1024; // 20 MB por archivo

@ApiTags('drive')
@Controller('public/drive')
export class DriveController {
  constructor(private readonly driveService: DriveService) {}

  @Post(':slug/upload')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FilesInterceptor('files', MAX_FILES, {
      storage: memoryStorage(),
      limits: { fileSize: MAX_SIZE_BYTES },
      fileFilter: (_req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
          cb(null, true);
        } else {
          cb(new BadRequestException('Solo se permiten imágenes'), false);
        }
      },
    }),
  )
  async upload(
    @Param('slug') slug: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    if (!files?.length) {
      throw new BadRequestException('No se recibieron archivos');
    }

    const results = await Promise.allSettled(
      files.map((f) => this.driveService.uploadFile(f, slug)),
    );
    console.log(results);
    const uploaded = results
      .filter((r) => r.status === 'fulfilled')
      .map((r) => (r as PromiseFulfilledResult<any>).value);

    const failed = results.filter((r) => r.status === 'rejected').length;

    return { uploaded: uploaded.length, failed, files: uploaded };
  }
}
