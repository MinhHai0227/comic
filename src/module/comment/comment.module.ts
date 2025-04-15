import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { UserModule } from '../user/user.module';
import { ComicModule } from '../comic/comic.module';
import { ChapterModule } from '../chapter/chapter.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  controllers: [CommentController],
  providers: [CommentService],
  imports: [UserModule, ComicModule, ChapterModule, NotificationModule],
})
export class CommentModule {}
