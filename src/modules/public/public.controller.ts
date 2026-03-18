import { Controller, Get, NotFoundException, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { InvitationStatus } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

@ApiTags("public")
@Controller("public")
export class PublicController {
  constructor(private readonly prisma: PrismaService) {}

  @Get("i/:slug")
  async getBySlug(@Param("slug") slug: string) {
    const inv = await this.prisma.invitation.findUnique({
      where: { slug },
      include: {
        template: true,
        photos: { orderBy: { order: "asc" } },
        rsvps: true,
        musicSuggestions: true,
        giftSuggestions: true,
      },
    });

    if (!inv || inv.status !== InvitationStatus.PUBLISHED) {
      throw new NotFoundException("Invitación no encontrada");
    }

    return inv;
  }
}
