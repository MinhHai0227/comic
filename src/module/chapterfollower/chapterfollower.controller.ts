import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { ChapterfollowerService } from './chapterfollower.service';
import { Roles } from 'src/decorator/roles.decorator';
import { PanigationChapterfollowerDto } from './dto/panigation-chapterfollower.dto';

@Controller('chapterfollower')
export class ChapterfollowerController {
  constructor(
    private readonly chapterfollowerService: ChapterfollowerService,
  ) {}

  @Roles('user')
  @Post(':comic_id')
  folowwerComic(
    @Request() req,
    @Param('comic_id', ParseIntPipe) comic_id: number,
  ) {
    return this.chapterfollowerService.folowwerComic(req.user.id, comic_id);
  }

  @Roles('user')
  @Get(':comic_id')
  checkComicFollowerExits(
    @Request() req,
    @Param('comic_id', ParseIntPipe) comic_id: number,
  ) {
    return this.chapterfollowerService.checkComicFollowerExits(
      req.user.id,
      comic_id,
    );
  }

  @Roles('user')
  @Delete(':comic_id')
  unFollowerComic(
    @Request() req,
    @Param('comic_id', ParseIntPipe) comic_id: number,
  ) {
    return this.chapterfollowerService.unFollowerComic(req.user.id, comic_id);
  }

  @Roles('user')
  @Get()
  getAllFollowerComic(
    @Request() req,
    @Query() query: PanigationChapterfollowerDto,
  ) {
    return this.chapterfollowerService.getAllFollowerComic(req.user.id, query);
  }
}
