import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMusicSuggestionDto {
  @ApiProperty({ example: 'Perfect' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Ed Sheeran', required: false })
  @IsOptional()
  @IsString()
  artist?: string;

  @ApiProperty({ example: 'https://open.spotify.com/track/...' , required: false })
  @IsOptional()
  @IsString()
  link?: string;
}
