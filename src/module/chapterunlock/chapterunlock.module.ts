import { Module } from '@nestjs/common';
import { ChapterunlockService } from './chapterunlock.service';
import { ChapterunlockController } from './chapterunlock.controller';
import { UserModule } from '../user/user.module';
import { ChapterModule } from '../chapter/chapter.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  controllers: [ChapterunlockController],
  providers: [ChapterunlockService],
  imports: [UserModule, ChapterModule, NotificationModule],
})
export class ChapterunlockModule {}
