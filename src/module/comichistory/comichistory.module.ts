import { Module } from '@nestjs/common';
import { ComichistoryService } from './comichistory.service';
import { ComichistoryController } from './comichistory.controller';
import { UserModule } from '../user/user.module';
import { ComicModule } from '../comic/comic.module';
import { ChapterModule } from '../chapter/chapter.module';

@Module({
  controllers: [ComichistoryController],
  providers: [ComichistoryService],
  imports: [UserModule, ComicModule, ChapterModule],
})
export class ComichistoryModule {}
