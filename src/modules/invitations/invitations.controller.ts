import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { InvitationsService } from "./invitations.service";
import { CreateInvitationDto } from "./dto/create-invitation.dto";
import { UpdateInvitationDto } from "./dto/update-invitation.dto";

@ApiTags("invitations")
@Controller("invitations")
export class InvitationsController {
  constructor(private readonly invitations: InvitationsService) {}

  @Post()
  create(@Body() dto: CreateInvitationDto) {
    return this.invitations.create(dto);
  }

  @Get()
  findAll() {
    return this.invitations.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.invitations.findById(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateInvitationDto) {
    return this.invitations.update(id, dto);
  }

  @Post(":id/publish")
  publish(@Param("id") id: string) {
    return this.invitations.publish(id);
  }

  @Post(":id/unpublish")
  unpublish(@Param("id") id: string) {
    return this.invitations.unpublish(id);
  }
}
