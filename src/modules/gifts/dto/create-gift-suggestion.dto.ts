import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateGiftSuggestionDto {
  @ApiProperty({ example: 'Set de copas' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'https://falabella.cl/...' , required: false })
  @IsOptional()
  @IsString()
  link?: string;

  @ApiProperty({ example: 'Color blanco', required: false })
  @IsOptional()
  @IsString()
  message?: string;
}
