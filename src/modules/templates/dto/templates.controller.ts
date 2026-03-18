import { Controller, Get, Param, Query } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { EventType } from "@prisma/client";
import { TemplatesService } from "../templates.service";
import { TemplateResponseDto } from "./template.dto";

@ApiTags("templates")
@Controller("templates")
export class TemplatesController {
  constructor(private readonly templates: TemplatesService) {}

  @Get()
  @ApiOkResponse({ type: [TemplateResponseDto] })
  findAll(@Query("eventType") eventType?: EventType) {
    return this.templates.findAll(eventType);
  }

  @Get(":id")
  @ApiOkResponse({ type: TemplateResponseDto })
  findOne(@Param("id") id: string) {
    return this.templates.findById(id);
  }
}
