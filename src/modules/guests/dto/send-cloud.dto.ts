import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsOptional, IsUUID } from "class-validator";

export class SendCloudDto {
  @ApiPropertyOptional({ description: "IDs de invitados a incluir" })
  @IsOptional()
  @IsArray()
  @IsUUID("4", { each: true })
  guestIds?: string[];

  @ApiPropertyOptional({ description: "Enviar a todos los invitados de la invitación" })
  @IsOptional()
  @IsBoolean()
  sendAll?: boolean;
}
