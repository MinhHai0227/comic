import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ComicService } from './comic.service';
import { CreateComicDto } from './dto/create-comic.dto';
import { UpdateComicDto } from './dto/update-comic.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { storage } from 'src/utils/upload.config';
import { Roles } from 'src/decorator/roles.decorator';
import { Public } from 'src/decorator/public.decorator';
import { PanigationComicDto } from './dto/panigation_comic.dto';

@Controller('comic')
export class ComicController {
  constructor(private readonly comicService: ComicService) {}

  @Post()
  @Roles('admin', 'editor')
  @UseInterceptors(FileInterceptor('file', storage))
  create(
    @Body() createComicDto: CreateComicDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Vui lòng chọn file');
    }
    return this.comicService.create(createComicDto, file);
  }

  @Get()
  @Public()
  findAll(@Query() query: PanigationComicDto) {
    return this.comicService.findAll(query);
  }

  @Roles('admin', 'editor')
  @Patch(':id')
  @UseInterceptors(FileInterceptor('file', storage))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateComicDto: UpdateComicDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.comicService.update(id, updateComicDto, file);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.comicService.remove(id);
  }

  @Public()
  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.comicService.findOne(slug);
  }

  @Roles('admin', 'editor')
  @Patch('active/:id')
  setIsActiveComic(@Param('id', ParseIntPipe) id: number) {
    return this.comicService.setIsActiveComic(id);
  }
}
