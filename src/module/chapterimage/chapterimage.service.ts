import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChapterService } from '../chapter/chapter.service';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ChapterimageService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly chapterService: ChapterService,
    private readonly configService: ConfigService,
  ) {}
  async create(chapter_id: number, files: Express.Multer.File[]) {
    await this.chapterService.checkChapterExits(chapter_id);
    const images = files.map((file) => ({
      chapterId: chapter_id,
      image_url: `${this.configService.get<string>('FILE_UPLOAD')}/${file.filename}`,
    }));
    const chapterImage = await this.prisma.chapter_image.createMany({
      data: images,
    });
    return {
      message: 'Thêm nhiều ChapterImage thành công',
      data: chapterImage,
    };
  }


  async removeAllImageByChapter(chapter_id: number) {
    const images = await this.prisma.chapter_image.findMany({
      where: { chapterId: chapter_id },
    });

    await Promise.all(
      images.map(async (image) => {
        const oldImageUrl = image.image_url.split('/uploadfile/')[1];
        const imagePath = path.join(
          __dirname,
          '..',
          '..',
          '..',
          'uploadfile',
          oldImageUrl,
        );

        try {
          await fs.promises.unlink(imagePath);
        } catch (err) {
          console.error(`Lỗi khi xóa ảnh: ${imagePath}`, err);
        }
      }),
    );

    await this.prisma.chapter_image.deleteMany({
      where: { chapterId: chapter_id },
    });

    return { message: `Xóa thành công All Image By Chapter ${chapter_id}` };
  }
}
