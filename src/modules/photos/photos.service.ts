import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { UpdatePhotoDto } from './dto/update-photo.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PhotosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(invitationId: string, dto: CreatePhotoDto) {
    const invitation = await this.prisma.invitation.findUnique({
      where: { id: invitationId },
    });

    if (!invitation) {
      throw new NotFoundException('Invitación no encontrada');
    }

    return this.prisma.photo.create({
      data: {
        invitationId,
        imageUrl: dto.imageUrl,
        caption: dto.caption,
        order: dto.order ?? 0,
      },
    });
  }

  findByInvitation(invitationId: string) {
    return this.prisma.photo.findMany({
      where: { invitationId },
      orderBy: { order: 'asc' },
    });
  }

  async update(photoId: string, dto: UpdatePhotoDto) {
    await this.ensureExists(photoId);

    return this.prisma.photo.update({
      where: { id: photoId },
      data: dto,
    });
  }

  async remove(photoId: string) {
    await this.ensureExists(photoId);

    return this.prisma.photo.delete({
      where: { id: photoId },
    });
  }

  private async ensureExists(id: string) {
    const photo = await this.prisma.photo.findUnique({ where: { id } });
    if (!photo) throw new NotFoundException('Foto no encontrada');
  }
}
