import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { GuestsService } from "./guests.service";
import { ImportGuestsDto } from "./dto/import-guests.dto";
import { UpdateGuestDto } from "./dto/update-guest.dto";
import { SendCloudDto } from "./dto/send-cloud.dto";

@ApiTags("guests")
@Controller("invitations/:invitationId/guests")
export class GuestsController {
  constructor(private readonly guests: GuestsService) {}

  @Get()
  list(@Param("invitationId") invitationId: string) {
    return this.guests.list(invitationId);
  }

  @Post("import")
  import(@Param("invitationId") invitationId: string, @Body() dto: ImportGuestsDto) {
    return this.guests.import(invitationId, dto);
  }

  @Patch(":guestId")
  update(
    @Param("invitationId") invitationId: string,
    @Param("guestId") guestId: string,
    @Body() dto: UpdateGuestDto,
  ) {
    return this.guests.update(invitationId, guestId, dto);
  }

  @Delete(":guestId")
  remove(@Param("invitationId") invitationId: string, @Param("guestId") guestId: string) {
    return this.guests.remove(invitationId, guestId);
  }

  @Post(":guestId/mark-sent")
  markSent(@Param("invitationId") invitationId: string, @Param("guestId") guestId: string) {
    return this.guests.markManualSent(invitationId, guestId);
  }

  /** Envío por WhatsApp Cloud API (plantilla Meta). Requiere variables de entorno WHATSAPP_CLOUD_* y PUBLIC_SITE_URL. */
  @Post("send-cloud")
  sendCloud(@Param("invitationId") invitationId: string, @Body() dto: SendCloudDto) {
    return this.guests.sendCloud(invitationId, dto);
  }
}
