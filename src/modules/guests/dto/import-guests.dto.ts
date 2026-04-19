import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsOptional, IsString, ValidateNested } from "class-validator";

export class ImportGuestRowDto {
  @ApiProperty({ example: "María" })
  @IsString()
  firstName: string;

  @ApiProperty({ example: "Pérez" })
  @IsString()
  lastName: string;

  @ApiProperty({ example: "+56912345678" })
  @IsString()
  phone: string;

  @ApiPropertyOptional({ description: "Mensaje por fila; si falta, usa plantilla de la invitación" })
  @IsOptional()
  @IsString()
  messageOverride?: string;
}

export class ImportGuestsDto {
  @ApiProperty({ type: [ImportGuestRowDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImportGuestRowDto)
  rows: ImportGuestRowDto[];

  @ApiPropertyOptional({
    description: "Si es true, borra invitados existentes de esta invitación antes de importar",
  })
  @IsOptional()
  @IsBoolean()
  replace?: boolean;
}
