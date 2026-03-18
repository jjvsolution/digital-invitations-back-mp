import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GiftsService } from './gifts.service';
import { CreateGiftSuggestionDto } from './dto/create-gift-suggestion.dto';

@ApiTags('gifts')
@Controller()
export class GiftsController {
  constructor(private readonly giftsService: GiftsService) {}

  // 🔓 Público
  @Post('public/i/:slug/gift-suggestions')
  create(@Param('slug') slug: string, @Body() dto: CreateGiftSuggestionDto) {
    return this.giftsService.createBySlug(slug, dto);
  }

  // 🔐 Admin
  @Get('invitations/:id/gift-suggestions')
  findAll(@Param('id') invitationId: string) {
    return this.giftsService.findByInvitation(invitationId);
  }

  @Delete('gift-suggestions/:id')
  remove(@Param('id') id: string) {
    return this.giftsService.remove(id);
  }
}
