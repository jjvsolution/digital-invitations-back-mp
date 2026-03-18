import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRsvpDto } from './dto/create-rsvp.dto';
import { InvitationStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RsvpService {
  constructor(private readonly prisma: PrismaService) {}

  async createBySlug(slug: string, dto: CreateRsvpDto) {
    const invitation = await this.prisma.invitation.findUnique({
      where: { slug },
    });

    if (!invitation || invitation.status !== InvitationStatus.PUBLISHED) {
      throw new NotFoundException('Invitación no válida');
    }

    return this.prisma.rsvp.create({
      data: {
        invitationId: invitation.id,
        name: dto.name,
        email: dto.email,
        guestsCount: dto.guestsCount,
        status: dto.status,
        message: dto.message,
      },
    });
  }

  async findByInvitation(invitationId: string) {
    return this.prisma.rsvp.findMany({
      where: { invitationId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async remove(rsvpId: string) {
    return this.prisma.rsvp.delete({
      where: { id: rsvpId },
    });
  }
}
