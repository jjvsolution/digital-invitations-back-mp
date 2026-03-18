import { ApiProperty } from '@nestjs/swagger';
import { RsvpStatus } from '@prisma/client';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateRsvpDto {
  @ApiProperty({ example: 'María González' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'maria@gmail.com', required: false })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(1)
  guestsCount: number;

  @ApiProperty({ enum: RsvpStatus })
  @IsEnum(RsvpStatus)
  status: RsvpStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  message?: string;
}
