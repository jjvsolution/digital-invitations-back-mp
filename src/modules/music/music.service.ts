import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMusicSuggestionDto } from './dto/create-music-suggestion.dto';
import { InvitationStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MusicService {
  constructor(private readonly prisma: PrismaService) {}

  async createBySlug(slug: string, dto: CreateMusicSuggestionDto) {
    const invitation = await this.prisma.invitation.findUnique({
      where: { slug },
    });

    if (!invitation || invitation.status !== InvitationStatus.PUBLISHED) {
      throw new NotFoundException('Invitación no válida');
    }

    return this.prisma.musicSuggestion.create({
      data: {
        invitationId: invitation.id,
        name: dto.name,
        artist: dto.artist,
        link: dto.link,
      },
    });
  }

  findByInvitation(invitationId: string) {
    return this.prisma.musicSuggestion.findMany({
      where: { invitationId },
      orderBy: { createdAt: 'desc' },
    });
  }

  remove(id: string) {
    return this.prisma.musicSuggestion.delete({
      where: { id },
    });
  }
}
