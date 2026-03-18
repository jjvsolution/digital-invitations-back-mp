import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdatePhotoDto {
  @ApiPropertyOptional({ example: 'Nuevo texto' })
  @IsOptional()
  @IsString()
  caption?: string;

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;
}
