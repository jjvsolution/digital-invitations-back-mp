import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MusicService } from './music.service';
import { CreateMusicSuggestionDto } from './dto/create-music-suggestion.dto';

@ApiTags('music')
@Controller()
export class MusicController {
  constructor(private readonly musicService: MusicService) {}

  // 🔓 Público
  @Post('public/i/:slug/music-suggestions')
  create(@Param('slug') slug: string, @Body() dto: CreateMusicSuggestionDto) {
    return this.musicService.createBySlug(slug, dto);
  }

  // 🔐 Admin
  @Get('invitations/:id/music-suggestions')
  findAll(@Param('id') invitationId: string) {
    return this.musicService.findByInvitation(invitationId);
  }

  @Delete('music-suggestions/:id')
  remove(@Param('id') id: string) {
    return this.musicService.remove(id);
  }
}
