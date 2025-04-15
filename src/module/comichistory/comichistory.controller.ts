import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Request,
} from '@nestjs/common';
import { ComichistoryService } from './comichistory.service';
import { CreateHistoryDto } from './dto/create-history.dto';
import { Roles } from 'src/decorator/roles.decorator';
import { Public } from 'src/decorator/public.decorator';

@Controller('comichistory')
export class ComichistoryController {
  constructor(private readonly comichistoryService: ComichistoryService) {}

  @Roles('user')
  @Post(':comic_id/:chapter_id')
  createAndUpdateComicHistory(@Request() req, @Param() dto: CreateHistoryDto) {
    return this.comichistoryService.createAndUpdateComicHistory(
      req.user.id,
      dto,
    );
  }

  @Roles('user')
  @Get()
  getAllHistoryComicByUser(@Request() req) {
    return this.comichistoryService.getAllHistoryComicByUser(req.user.id);
  }

  @Roles('user')
  @Get(':comic_id')
  getChapterlast(
    @Request() req,
    @Param('comic_id', ParseIntPipe) comic_id: number,
  ) {
    return this.comichistoryService.getChapterlast(req.user.id, comic_id);
  }

  @Roles('user')
  @Delete(':comic_id')
  deleteHistoryComic(
    @Request() req,
    @Param('comic_id', ParseIntPipe) comic_id: number,
  ) {
    return this.comichistoryService.deleteHistoryComic(req.user.id, comic_id);
  }
}
