import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from '../user/user.service';
import { ChapterService } from '../chapter/chapter.service';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class ChapterunlockService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly chapterService: ChapterService,
    private readonly notificationService: NotificationService,
  ) {}

  async checkUserUnlock(user_id: number, chapter_id: number) {
    await this.userService.checkUserExis(user_id);
    await this.chapterService.checkChapterExits(chapter_id);

    const userUnlock = await this.prisma.chapter_unlock.findFirst({
      where: {
        userId: user_id,
        chapterId: chapter_id,
      },
    });
    return !!userUnlock;
  }

  async userUnlockChapter(user_id: number, chapter_id: number) {
    await this.userService.checkUserExis(user_id);
    const chapter = await this.chapterService.checkChapterExits(chapter_id);

    const checkUnlock = await this.checkUserUnlock(user_id, chapter_id);
    if (checkUnlock === true) {
      throw new BadRequestException('Bạn đã mở khóa chapter này');
    }
    const currentTime = new Date();
    const autoUnlock = currentTime > chapter.auto_unlock_time;
    if (autoUnlock) {
      throw new BadRequestException('Chapter đã được mở khóa tự động');
    }

    await this.userService.updatetotalPrice(user_id, chapter.price_xu ?? 0);

    await this.notificationService.notifiUnlockChapter(user_id, chapter.slug);

    await this.prisma.chapter_unlock.create({
      data: {
        userId: user_id,
        chapterId: chapter_id,
      },
    });

    return {
      message: `Mở khóa thành công Chapter có id ${chapter_id}`,
    };
  }
}
