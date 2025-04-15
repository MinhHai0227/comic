import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Roles } from 'src/decorator/roles.decorator';
import { PanigationCommentDto } from './dto/panigation-comment.dto';
import { Public } from 'src/decorator/public.decorator';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Public()
  @Get('chapter/:chapter_id')
  getAllCommentByChapter(
    @Param('chapter_id', ParseIntPipe) chapter_id: number,
    @Query() query: PanigationCommentDto,
  ) {
    return this.commentService.getAllCommentByChapter(chapter_id, query);
  }

  @Public()
  @Get('comic/:comic_id')
  getAllCommentByComic(
    @Param('comic_id', ParseIntPipe) comic_id: number,
    @Query() query: PanigationCommentDto,
  ) {
    return this.commentService.getAllCommentByComic(comic_id, query);
  }

  @Post()
  createComment(@Request() req, @Body() createCommentDto: CreateCommentDto) {
    return this.commentService.createComment(req.user.id, createCommentDto);
  }

  @Roles('admin', 'user')
  @Delete(':id')
  deleteCommentByUser(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.commentService.deleteCommentByUser(req.user.id, id);
  }

  @Roles('user')
  @Patch(':id')
  updateCommentByUser(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentService.updateCommentByUser(
      req.user.id,
      id,
      updateCommentDto,
    );
  }
}
