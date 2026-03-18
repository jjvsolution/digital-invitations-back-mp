import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGiftSuggestionDto } from './dto/create-gift-suggestion.dto';
import { InvitationStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GiftsService {
  constructor(private readonly prisma: PrismaService) {}

  async createBySlug(slug: string, dto: CreateGiftSuggestionDto) {
    const invitation = await this.prisma.invitation.findUnique({
      where: { slug },
    });

    if (!invitation || invitation.status !== InvitationStatus.PUBLISHED) {
      throw new NotFoundException('Invitación no válida');
    }

    return this.prisma.giftSuggestion.create({
      data: {
        invitationId: invitation.id,
        name: dto.name,
        link: dto.link,
        message: dto.message,
      },
    });
  }

  findByInvitation(invitationId: string) {
    return this.prisma.giftSuggestion.findMany({
      where: { invitationId },
      orderBy: { createdAt: 'desc' },
    });
  }

  remove(id: string) {
    return this.prisma.giftSuggestion.delete({
      where: { id },
    });
  }
}
