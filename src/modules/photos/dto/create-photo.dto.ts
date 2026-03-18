import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreatePhotoDto {
  @ApiProperty({ example: 'https://cdn.tusitio.com/img1.jpg' })
  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  @ApiProperty({ example: 'Nuestra primera foto', required: false })
  @IsOptional()
  @IsString()
  caption?: string;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;
}
