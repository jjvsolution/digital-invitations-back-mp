import { ApiProperty } from "@nestjs/swagger";
import { EventType } from "@prisma/client";
import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateInvitationDto {
  @ApiProperty() @IsString() @IsNotEmpty()
  title: string;

  @ApiProperty({ enum: EventType }) @IsEnum(EventType)
  eventType: EventType;

  @ApiProperty() @IsDateString()
  eventDate: string; // ISO

  @ApiProperty() @IsString() @IsNotEmpty()
  templateId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  settings?: any;

  @ApiProperty({ required: false })
  @IsOptional()
  sections?: any;
}
