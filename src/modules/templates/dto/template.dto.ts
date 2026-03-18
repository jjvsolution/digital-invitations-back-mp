import { ApiProperty } from "@nestjs/swagger";
import { EventType } from "@prisma/client";

export class TemplateResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiProperty({ enum: EventType }) eventType: EventType;
  @ApiProperty({ required: false }) previewImageUrl?: string | null;
  @ApiProperty({ type: "object", additionalProperties: true }) defaultSettings: any;
  @ApiProperty({ type: "object", additionalProperties: true }) defaultSections: any;
  @ApiProperty() createdAt: Date;
}
