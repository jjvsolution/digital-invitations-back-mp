import { ApiPropertyOptional } from "@nestjs/swagger";
import { InvitationStatus } from "@prisma/client";
import { IsDateString, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateInvitationDto {
  @ApiPropertyOptional() @IsOptional() @IsString()
  title?: string;

  @ApiPropertyOptional() @IsOptional() @IsDateString()
  eventDate?: string;

  @ApiPropertyOptional() @IsOptional() @IsString()
  locationName?: string;

  @ApiPropertyOptional() @IsOptional() @IsString()
  address?: string;

  @ApiPropertyOptional() @IsOptional() @IsNumber()
  latitude?: number;

  @ApiPropertyOptional() @IsOptional() @IsNumber()
  longitude?: number;

  @ApiPropertyOptional() @IsOptional() @IsString()
  coverImageUrl?: string;

  @ApiPropertyOptional() @IsOptional() @IsString()
  message?: string;

  @ApiPropertyOptional({ type: "object", additionalProperties: true }) @IsOptional()
  settings?: any;

  @ApiPropertyOptional({ type: "object", additionalProperties: true }) @IsOptional()
  sections?: any;

  @ApiPropertyOptional({ enum: InvitationStatus })
  @IsOptional() @IsEnum(InvitationStatus)
  status?: InvitationStatus;
}
