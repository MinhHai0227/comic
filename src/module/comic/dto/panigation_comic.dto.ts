import { ParseBoolPipe } from '@nestjs/common';
import { comicStatus } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsOptional, Min } from 'class-validator';

export class PanigationComicDto {
  @IsOptional()
  @Min(1)
  @Transform(({ value }) => parseInt(value))
  page: number = 1;

  @IsOptional()
  @Min(1)
  @Transform(({ value }) => parseInt(value))
  limit: number = 10;

  @IsOptional()
  search: string;

  @IsOptional()
  status: comicStatus;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  country: number;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  active: boolean = false;
}
