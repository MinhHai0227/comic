import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from '../user/user.service';
import { ComicService } from '../comic/comic.service';
import { ChapterService } from '../chapter/chapter.service';
import { CreateHistoryDto } from './dto/create-history.dto';

@Injectable()
export class ComichistoryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly comicService: ComicService,
    private readonly chapterService: ChapterService,
  ) {}

  async getChapterlast(user_id: number, comic_id: number) {
    const comic = await this.prisma.comic_history.findUnique({
      where: {
        userId_comicId: {
          userId: user_id,
          comicId: comic_id,
        },
      },
      include: {
        chapter: {
          select: {
            id: true,
            chapter_name: true,
            chapter_title: true,
            slug: true,
            is_lokesd: true,
            price_xu: true,
            auto_unlock_time: true,
            views: true,
            chapter_image_url: true,
            create_at: true,
          },
        },
      },
    });
    if (!comic) {
      return false;
    }
    const chapter = comic.chapter;
    return chapter;
  }

  async ensureHiatoryLimit(user_id: number) {
    const count = await this.prisma.comic_history.count({
      where: {
        userId: user_id,
      },
    });
    if (count >= 100) {
      const oldest = await this.prisma.comic_history.findFirst({
        where: {
          userId: user_id,
        },
        orderBy: { read_time: 'asc' },
      });

      if (oldest) {
        await this.prisma.comic_history.delete({
          where: {
            id: oldest.id,
          },
        });
      }
    }
  }

  async createAndUpdateComicHistory(user_id: number, dto: CreateHistoryDto) {
    await this.userService.checkUserExis(user_id);
    await this.comicService.checkComicExits(dto.comic_id);
    await this.chapterService.checkChapterExits(dto.chapter_id);
    await this.ensureHiatoryLimit(user_id);
    const comicHistoryExits = await this.prisma.comic_history.findUnique({
      where: {
        userId_comicId: {
          userId: user_id,
          comicId: dto.comic_id,
        },
      },
    });
    if (comicHistoryExits) {
      await this.prisma.comic_history.update({
        where: {
          userId_comicId: {
            userId: user_id,
            comicId: dto.comic_id,
          },
        },
        data: {
          chapterId: dto.chapter_id,
          read_time: new Date(),
        },
      });
      return {
        message: `Đã cập nhật lịch sử Comic có ID ${dto.comic_id} với chapter có ID là ${dto.chapter_id}`,
      };
    }

    await this.prisma.comic_history.create({
      data: {
        userId: user_id,
        comicId: dto.comic_id,
        chapterId: dto.chapter_id,
      },
    });
    return {
      message: `Đã lưu lịch sử Comic có ID ${dto.comic_id} với chapter có ID là ${dto.chapter_id}`,
    };
  }

  async getAllHistoryComicByUser(user_id: number) {
    const comicHistory = await this.prisma.comic_history.findMany({
      where: {
        userId: user_id,
        comic: {
          is_active: false,
        },
      },
      orderBy: {
        read_time: 'desc',
      },
      include: {
        comic: {
          select: {
            id: true,
            title: true,
            title_eng: true,
            slug: true,
            status: true,
            cover_image: true,
          },
        },
        chapter: {
          select: {
            id: true,
            chapter_name: true,
            chapter_title: true,
            slug: true,
            is_lokesd: true,
            price_xu: true,
            auto_unlock_time: true,
            views: true,
            chapter_image_url: true,
            create_at: true,
          },
        },
      },
    });

    return { data: comicHistory };
  }

  async deleteHistoryComic(user_id: number, comic_id: number) {
    const comic = await this.prisma.comic_history.findUnique({
      where: {
        userId_comicId: {
          userId: user_id,
          comicId: comic_id,
        },
      },
    });
    if (!comic) {
      throw new BadRequestException('Bạn chưa đọc bộ này');
    }
    await this.prisma.comic_history.delete({
      where: {
        id: comic.id,
      },
    });
    return {message:`Xóa thành công comic đã đọc`}
  }
}
