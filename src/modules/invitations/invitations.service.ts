import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateInvitationDto } from "./dto/create-invitation.dto";
import { UpdateInvitationDto } from "./dto/update-invitation.dto";
import { nanoid } from "nanoid";
import { InvitationStatus } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class InvitationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateInvitationDto) {
    const template = await this.prisma.template.findUnique({ where: { id: dto.templateId } });
    if (!template) throw new BadRequestException("Template no existe");

    // slug corto para link público
    const slug = nanoid(8);

    return this.prisma.invitation.create({
      data: {
        slug,
        title: dto.title,
        eventType: dto.eventType,
        eventDate: new Date(dto.eventDate),
        templateId: dto.templateId,
        settings: dto.settings ?? template.defaultSettings,
        sections: dto.sections ?? template.defaultSections,
      },
      include: { template: true },
    });
  }

  findAll() {
    return this.prisma.invitation.findMany({
      orderBy: { createdAt: "desc" },
      include: { template: true },
    });
  }

  async findById(id: string) {
    const inv = await this.prisma.invitation.findUnique({
      where: { id },
      include: { template: true, photos: true },
    });
    if (!inv) throw new NotFoundException("Invitación no encontrada");
    return inv;
  }

  async update(id: string, dto: UpdateInvitationDto) {
    await this.findById(id);

    return this.prisma.invitation.update({
      where: { id },
      data: {
        ...dto,
        eventDate: dto.eventDate ? new Date(dto.eventDate) : undefined,
      },
      include: { template: true },
    });
  }

  async publish(id: string) {
    await this.findById(id);

    return this.prisma.invitation.update({
      where: { id },
      data: { status: InvitationStatus.PUBLISHED },
    });
  }

  async unpublish(id: string) {
    await this.findById(id);

    return this.prisma.invitation.update({
      where: { id },
      data: { status: InvitationStatus.DRAFT },
    });
  }
}
