import { Module } from '@nestjs/common';
import { ChapterfollowerService } from './chapterfollower.service';
import { ChapterfollowerController } from './chapterfollower.controller';
import { UserModule } from '../user/user.module';
import { ComicModule } from '../comic/comic.module';

@Module({
  controllers: [ChapterfollowerController],
  providers: [ChapterfollowerService],
  imports:[UserModule, ComicModule]
})
export class ChapterfollowerModule {}
