import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PhotosService } from './photos.service';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { UpdatePhotoDto } from './dto/update-photo.dto';

@ApiTags('photos')
@Controller()
export class PhotosController {
  constructor(private readonly photosService: PhotosService) {}

  // 🔐 Admin – agregar foto
  @Post('invitations/:id/photos')
  create(
    @Param('id') invitationId: string,
    @Body() dto: CreatePhotoDto,
  ) {
    return this.photosService.create(invitationId, dto);
  }

  // 🔐 Admin – listar fotos
  @Get('invitations/:id/photos')
  findAll(@Param('id') invitationId: string) {
    return this.photosService.findByInvitation(invitationId);
  }

  // 🔐 Admin – actualizar caption / orden
  @Patch('photos/:id')
  update(@Param('id') photoId: string, @Body() dto: UpdatePhotoDto) {
    return this.photosService.update(photoId, dto);
  }

  // 🔐 Admin – eliminar foto
  @Delete('photos/:id')
  remove(@Param('id') photoId: string) {
    return this.photosService.remove(photoId);
  }
}
