import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from "@nestjs/common";
import { GuestSendMethod } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { ConfigService } from "@nestjs/config";
import { ImportGuestsDto } from "./dto/import-guests.dto";
import { UpdateGuestDto } from "./dto/update-guest.dto";
import { SendCloudDto } from "./dto/send-cloud.dto";
import { toE164 } from "./phone.util";
import { WhatsappCloudService } from "./whatsapp-cloud.service";

@Injectable()
export class GuestsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly whatsapp: WhatsappCloudService,
  ) {}

  private async ensureInvitation(invitationId: string) {
    const inv = await this.prisma.invitation.findUnique({ where: { id: invitationId } });
    if (!inv) throw new NotFoundException("Invitación no encontrada");
    return inv;
  }

  list(invitationId: string) {
    return this.ensureInvitation(invitationId).then(() =>
      this.prisma.invitationGuest.findMany({
        where: { invitationId },
        orderBy: { createdAt: "asc" },
      }),
    );
  }

  async import(invitationId: string, dto: ImportGuestsDto) {
    await this.ensureInvitation(invitationId);

    if (dto.replace) {
      await this.prisma.invitationGuest.deleteMany({ where: { invitationId } });
    }

    const rows = dto.rows ?? [];
    if (rows.length === 0) {
      return { imported: 0, guests: [] as Awaited<ReturnType<GuestsService["list"]>> };
    }

    const data = rows.map((r) => ({
      invitationId,
      firstName: r.firstName.trim() || "",
      lastName: r.lastName.trim() || "",
      phone: toE164(r.phone),
      messageOverride: r.messageOverride?.trim() || null,
    }));

    await this.prisma.invitationGuest.createMany({ data });

    return {
      imported: data.length,
      guests: await this.list(invitationId),
    };
  }

  async update(invitationId: string, guestId: string, dto: UpdateGuestDto) {
    await this.ensureInvitation(invitationId);
    const existing = await this.prisma.invitationGuest.findFirst({
      where: { id: guestId, invitationId },
    });
    if (!existing) throw new NotFoundException("Invitado no encontrado");

    return this.prisma.invitationGuest.update({
      where: { id: guestId },
      data: {
        firstName: dto.firstName?.trim() ?? undefined,
        lastName: dto.lastName?.trim() ?? undefined,
        phone: dto.phone != null ? toE164(dto.phone) : undefined,
        messageOverride:
          dto.messageOverride === undefined
            ? undefined
            : dto.messageOverride === null || dto.messageOverride === ""
              ? null
              : dto.messageOverride.trim(),
      },
    });
  }

  async remove(invitationId: string, guestId: string) {
    await this.ensureInvitation(invitationId);
    const existing = await this.prisma.invitationGuest.findFirst({
      where: { id: guestId, invitationId },
    });
    if (!existing) throw new NotFoundException("Invitado no encontrado");
    await this.prisma.invitationGuest.delete({ where: { id: guestId } });
  }

  /** Marca que el mensaje ya fue enviado (p. ej. WhatsApp manual sin API). */
  async markManualSent(invitationId: string, guestId: string) {
    await this.ensureInvitation(invitationId);
    const existing = await this.prisma.invitationGuest.findFirst({
      where: { id: guestId, invitationId },
    });
    if (!existing) throw new NotFoundException("Invitado no encontrado");

    return this.prisma.invitationGuest.update({
      where: { id: guestId },
      data: {
        lastSentAt: new Date(),
        lastSendMethod: GuestSendMethod.MANUAL,
        lastError: null,
      },
    });
  }

  private publicInviteUrl(slug: string): string {
    const base = this.config.get<string>("PUBLIC_SITE_URL")?.trim().replace(/\/$/, "");
    if (!base) {
      throw new BadRequestException(
        "Configure PUBLIC_SITE_URL en el servidor (origen del sitio público, ej. https://midominio.com)",
      );
    }
    return `${base}/i/${slug}`;
  }

  async sendCloud(invitationId: string, dto: SendCloudDto) {
    const inv = await this.ensureInvitation(invitationId);

    if (!this.whatsapp.isConfigured()) {
      throw new ServiceUnavailableException(
        "WhatsApp Cloud API no está configurada (variables WHATSAPP_CLOUD_*)",
      );
    }

    const sendAll = dto.sendAll === true;
    const ids = dto.guestIds?.filter(Boolean) ?? [];
    if (!sendAll && ids.length === 0) {
      throw new BadRequestException("Indique guestIds o sendAll: true");
    }

    const guests = await this.prisma.invitationGuest.findMany({
      where: {
        invitationId,
        ...(sendAll ? {} : { id: { in: ids } }),
      },
    });

    if (guests.length === 0) {
      return { sent: 0, results: [] as { guestId: string; ok: boolean; error?: string }[] };
    }

    const inviteUrl = this.publicInviteUrl(inv.slug);
    const results: { guestId: string; ok: boolean; error?: string }[] = [];

    const delayMs = Number(this.config.get<string>("WHATSAPP_SEND_DELAY_MS")) || 600;

    for (let i = 0; i < guests.length; i++) {
      const g = guests[i];
      const fullName = `${g.firstName} ${g.lastName}`.trim();
      try {
        await this.whatsapp.sendTemplateMessage(g.phone, [fullName, inviteUrl]);
        await this.prisma.invitationGuest.update({
          where: { id: g.id },
          data: {
            lastSentAt: new Date(),
            lastSendMethod: GuestSendMethod.CLOUD_API,
            lastError: null,
          },
        });
        results.push({ guestId: g.id, ok: true });
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        await this.prisma.invitationGuest.update({
          where: { id: g.id },
          data: {
            lastSendMethod: GuestSendMethod.CLOUD_API,
            lastError: msg.slice(0, 500),
          },
        });
        results.push({ guestId: g.id, ok: false, error: msg });
      }
      if (i < guests.length - 1 && delayMs > 0) {
        await new Promise((r) => setTimeout(r, delayMs));
      }
    }

    return {
      sent: results.filter((r) => r.ok).length,
      failed: results.filter((r) => !r.ok).length,
      results,
    };
  }
}
