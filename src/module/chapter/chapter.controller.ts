import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ChapterService } from './chapter.service';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';
import { Roles } from 'src/decorator/roles.decorator';
import { Public } from 'src/decorator/public.decorator';

@Controller('chapter')
export class ChapterController {
  constructor(private readonly chapterService: ChapterService) {}

  @Roles('admin', 'editor')
  @Post()
  create(@Body() createChapterDto: CreateChapterDto) {
    return this.chapterService.create(createChapterDto);
  }

  @Public()
  @Get(':slug')
  findOneBySlug(@Param('slug') slug: string) {
    return this.chapterService.findOneBySlug(slug);
  }

  @Roles('admin', 'editor')
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateChapterDto: UpdateChapterDto,
  ) {
    return this.chapterService.update(id, updateChapterDto);
  }

  @Roles('admin', 'editor')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.chapterService.remove(id);
  }
}
