import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RsvpService } from './rsvp.service';
import { CreateRsvpDto } from './dto/create-rsvp.dto';

@ApiTags('rsvp')
@Controller()
export class RsvpController {
  constructor(private readonly rsvpService: RsvpService) {}

  // 🔓 Público – confirmar asistencia
  @Post('public/i/:slug/rsvp')
  createRsvp(
    @Param('slug') slug: string,
    @Body() dto: CreateRsvpDto,
  ) {
    return this.rsvpService.createBySlug(slug, dto);
  }

  // 🔐 Admin – listar confirmaciones
  @Get('invitations/:id/rsvps')
  getRsvps(@Param('id') invitationId: string) {
    return this.rsvpService.findByInvitation(invitationId);
  }

  // 🔐 Admin – eliminar confirmación
  @Delete('rsvps/:id')
  deleteRsvp(@Param('id') rsvpId: string) {
    return this.rsvpService.remove(rsvpId);
  }
}
