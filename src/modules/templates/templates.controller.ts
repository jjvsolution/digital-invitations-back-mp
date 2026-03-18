import { Controller, Get, Param, Query } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { TemplatesService } from "./templates.service";
import { EventType } from "@prisma/client";
import { TemplateResponseDto } from "./dto/template.dto";

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
