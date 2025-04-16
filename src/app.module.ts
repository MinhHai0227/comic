import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './module/user/user.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/passport/jwt-auth.guard';
import { RolesGuard } from './auth/passport/roles.guard';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { CoinModule } from './module/coin/coin.module';
import { CountryModule } from './module/country/country.module';
import { CategoryModule } from './module/category/category.module';
import { ComicModule } from './module/comic/comic.module';
import { ChapterModule } from './module/chapter/chapter.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ChapterimageModule } from './module/chapterimage/chapterimage.module';
import { ChapterunlockModule } from './module/chapterunlock/chapterunlock.module';
import { ChapterfollowerModule } from './module/chapterfollower/chapterfollower.module';
import { ComichistoryModule } from './module/comichistory/comichistory.module';
import { CommentModule } from './module/comment/comment.module';
import { NotificationModule } from './module/notification/notification.module';
import { TransactionModule } from './module/transaction/transaction.module';
import { MomoModule } from './momo/momo.module';


@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploadfile'),
      serveRoot: '/uploadfile',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    PrismaModule,
    UserModule,
    AuthModule,
    CoinModule,
    CountryModule,
    CategoryModule,
    ComicModule,
    ChapterModule,
    ChapterimageModule,
    ChapterunlockModule,
    ChapterfollowerModule,
    ComichistoryModule,
    CommentModule,
    NotificationModule,
    TransactionModule,
    MomoModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
