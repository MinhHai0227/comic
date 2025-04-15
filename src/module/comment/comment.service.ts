import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from '../user/user.service';
import { ComicService } from '../comic/comic.service';
import { ChapterService } from '../chapter/chapter.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { NotificationService } from '../notification/notification.service';
import { PanigationCommentDto } from './dto/panigation-comment.dto';
import { userRole } from '@prisma/client';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly comicService: ComicService,
    private readonly chapterService: ChapterService,
    private readonly notificationService: NotificationService,
  ) {}

  async getAllCommentByChapter(
    chapter_id: number,
    query: PanigationCommentDto,
  ) {
    const { page, limit } = query;
    const skip = (page - 1) * limit;
    await this.chapterService.checkChapterExits(chapter_id);
    const [chapterComment, totalItem] = await this.prisma.$transaction([
      this.prisma.comment.findMany({
        where: {
          chapterId: chapter_id,
          parentId: null,
        },
        orderBy: {
          create_at: 'desc',
        },
        take: limit,
        skip,
        include: {
          user: {
            select: {
              username: true,
              avatar: true,
            },
          },
          replies: {
            select: {
              id: true,
              content: true,
              user: {
                select: {
                  username: true,
                  avatar: true,
                },
              },
            },
          },
        },
      }),
      this.prisma.comment.count({
        where: {
          chapterId: chapter_id,
          parentId: null,
        },
      }),
    ]);

    const totalPage = Math.ceil(totalItem / limit);
    const totalItemPerPage = limit;
    const currentPage = page;
    const prevPage = page > 1 ? page - 1 : 1;
    const nextPage = page < totalPage ? page + 1 : totalPage;

    return {
      data: chapterComment,
      totalItem,
      totalPage,
      totalItemPerPage,
      currentPage,
      prevPage,
      nextPage,
    };
  }

  async getAllCommentByComic(comic_id: number, query: PanigationCommentDto) {
    const { page, limit } = query;
    const skip = (page - 1) * limit;
    await this.comicService.checkComicExits(comic_id);
    const [comicComment, totalItem] = await this.prisma.$transaction([
      this.prisma.comment.findMany({
        where: {
          comicId: comic_id,
          parentId: null,
        },
        orderBy: {
          create_at: 'desc',
        },
        take: limit,
        skip,
        include: {
          user: {
            select: {
              username: true,
              avatar: true,
            },
          },
          replies: {
            select: {
              id: true,
              content: true,
              user: {
                select: {
                  username: true,
                  avatar: true,
                },
              },
            },
          },
        },
      }),

      this.prisma.comment.count({
        where: {
          comicId: comic_id,
          parentId: null,
        },
      }),
    ]);

    const totalPage = Math.ceil(totalItem / limit);
    const totalItemPerPage = limit;
    const currentPage = page;
    const prevPage = page > 1 ? page - 1 : 1;
    const nextPage = page < totalPage ? page + 1 : totalPage;

    return {
      data: comicComment,
      totalItem,
      totalPage,
      totalItemPerPage,
      currentPage,
      prevPage,
      nextPage,
    };
  }

  async createComment(user_id: number, createCommentDto: CreateCommentDto) {
    const user = await this.userService.checkUserExis(user_id);
    const newComment = await this.prisma.comment.create({
      data: {
        userId: user_id,
        comicId: createCommentDto.comic_id,
        chapterId: createCommentDto.chapter_id,
        parentId: createCommentDto.parent_id,
        content: createCommentDto.content,
      },
      include: {
        parent: {
          select: {
            userId: true,
          },
        },
      },
    });
    if (createCommentDto.parent_id) {
      const parentComment = newComment.parent;
      if (
        parentComment?.userId != user_id &&
        parentComment?.userId != undefined
      ) {
        await this.notificationService.notifiCommentReplay(
          parentComment.userId,
          user.username,
        );
      }
    }

    return newComment;
  }

  async checkCommentExits(comment_id: number) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: comment_id },
    });
    if (!comment) {
      throw new NotFoundException('Comment không tồn tại');
    }
    return comment;
  }

  async deleteCommentByUser(user_id: number, comment_id: number) {
    const comment = await this.checkCommentExits(comment_id);
    const user = await this.userService.checkUserExis(user_id);

    if (comment.userId != user.id && user.role != userRole.admin) {
      throw new ForbiddenException(
        'Bạn không thể xóa bình luận của người khác',
      );
    }

    await this.prisma.comment.delete({
      where: { id: comment_id },
    });

    return {
      message: `Xóa thành công comment có id là ${comment_id}`,
    };
  }

  async updateCommentByUser(
    user_id: number,
    comment_id: number,
    updatecommentDto: UpdateCommentDto,
  ) {
    const user = await this.userService.checkUserExis(user_id);
    const comment = await this.checkCommentExits(comment_id);

    if (user.id != comment.userId) {
      throw new ForbiddenException(
        'Bạn không thể chỉnh sửa bình luận của người khác',
      );
    }
    const updateComment = await this.prisma.comment.update({
      where: {
        id: comment_id,
      },
      data: {
        content: updatecommentDto.content,
      },
    });

    return {
      message: 'Update comment thành công',
      data: updateComment,
    };
  }
}
