import { PartialType } from '@nestjs/mapped-types';
import { CreateComicDto } from './create-comic.dto';
import { comicStatus } from '@prisma/client';
import { IsOptional } from 'class-validator';

export class UpdateComicDto extends PartialType(CreateComicDto) {}
