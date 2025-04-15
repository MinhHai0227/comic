import { forwardRef, Module } from '@nestjs/common';
import { ComicService } from './comic.service';
import { ComicController } from './comic.controller';
import { CountryModule } from '../country/country.module';
import { CategoryModule } from '../category/category.module';

@Module({
  controllers: [ComicController],
  providers: [ComicService],
  imports: [CountryModule, CategoryModule],
  exports: [ComicService],
})
export class ComicModule {}
