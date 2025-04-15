import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateComicDto } from './dto/create-comic.dto';
import { UpdateComicDto } from './dto/update-comic.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CategoryService } from '../category/category.service';
import { CountryService } from '../country/country.service';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import * as fs from 'fs';
import { PanigationComicDto } from './dto/panigation_comic.dto';
import { comicStatus } from '@prisma/client';

@Injectable()
export class ComicService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly categoryService: CategoryService,
    private readonly countryService: CountryService,
    private readonly configService: ConfigService,
  ) {}

  async create(createComicDto: CreateComicDto, file: Express.Multer.File) {
    const comicSlug = await this.prisma.comic.findUnique({
      where: { slug: createComicDto.slug },
    });
    if (comicSlug) {
      throw new BadRequestException('CategorySlug đã tồn tại');
    }

    await this.countryService.checkCountryExits(createComicDto.countryId);
    await this.categoryService.checkArrayIdCategoryExits(
      createComicDto.categoryId,
    );
    const { categoryId, ...data } = createComicDto;

    const comic = await this.prisma.comic.create({
      data: {
        cover_image: `${this.configService.get<string>('FILE_UPLOAD')}/${file.filename}`,
        categories: {
          connect: categoryId.map((id) => ({ id: id })),
        },
        ...data,
      },
    });

    return {
      message: 'Thêm Comic thành công',
      data: comic,
    };
  }

  async findAll(query: PanigationComicDto) {
    const { page, limit, search, status, country, active } = query;
    const skip = (page - 1) * limit;
    const comics = await this.prisma.comic.findMany({
      take: limit,
      skip,
      orderBy: { create_at: 'desc' },
      where: {
        AND: [
          status ? { status: status } : {},
          { countryId: country },
          { is_active: active },
          {
            OR: [
              { title: { contains: search } },
              { title_eng: { contains: search } },
            ],
          },
        ],
      },
      include: {
        chapters: {
          orderBy: { create_at: 'desc' },
          take: 1,
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
    const customComic = comics.map(
      ({
        description,
        author,
        views,
        likes,
        is_active,
        create_at,
        update_at,
        countryId,
        ...data
      }) => data,
    );
    const totalItem = await this.prisma.comic.count({
      where: {
        is_active: false,
      },
    });
    const totalPage = Math.ceil(totalItem / limit);
    const totalItemPerPage = limit;
    const currentPage = page;
    const prevPage = page > 1 ? page - 1 : 1;
    const nextPage = page < totalPage ? page + 1 : totalPage;
    return {
      data: customComic,
      totalItem,
      totalPage,
      totalItemPerPage,
      currentPage,
      prevPage,
      nextPage,
    };
  }

  async checkComicExits(comicId: number) {
    const comic = await this.prisma.comic.findUnique({
      where: { id: comicId },
    });
    if (!comic) {
      throw new NotFoundException('Comic không tòn tại');
    }
    return comic;
  }

  async update(
    id: number,
    updateComicDto: UpdateComicDto,
    file: Express.Multer.File,
  ) {
    await this.categoryService.checkArrayIdCategoryExits(
      updateComicDto.categoryId || [],
    );
    const checkComic = await this.checkComicExits(id);
    if (checkComic && checkComic.cover_image) {
      const fileComic = checkComic.cover_image.split('/uploadfile/')[1];
      const oldComicFile = path.join(
        __dirname,
        '..',
        '..',
        '..',
        'uploadfile',
        fileComic,
      );
      try {
        if (fs.existsSync(oldComicFile)) {
          fs.unlinkSync(oldComicFile);
        }
      } catch {
        throw new BadRequestException('Không thể xóa ảnh | Ảnh không tồn tại');
      }
    }
    const { categoryId, slug, ...data } = updateComicDto;
    const comic = await this.prisma.comic.update({
      where: { id: id },
      data: {
        cover_image: `${this.configService.get<string>('FILE_UPLOAD')}/${file.filename}`,
        categories: {
          connect: categoryId?.map((id) => ({ id: id })),
        },
        ...data,
      },
    });
    return {
      message: 'Cập nhật Comic thành công',
      data: comic,
    };
  }

  async remove(id: number) {
    const checkComic = await this.checkComicExits(id);
    if (checkComic && checkComic.cover_image) {
      const fileComic = checkComic.cover_image.split('/uploadfile/')[1];
      const oldComicFile = path.join(
        __dirname,
        '..',
        '..',
        '..',
        'uploadfile',
        fileComic,
      );
      try {
        if (fs.existsSync(oldComicFile)) {
          fs.unlinkSync(oldComicFile);
        }
      } catch {
        throw new BadRequestException('Không thể xóa ảnh | Ảnh không tồn tại');
      }
      const comic = await this.prisma.comic.delete({
        where: { id: id },
      });

      return `Xóa thành công Comic có id ${comic.id} `;
    }
  }

  async findOne(slug: string) {
    const comic = await this.prisma.comic.findUnique({
      where: { slug: slug },
      include: {
        categories: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        chapters: {
          orderBy: { create_at: 'desc' },
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
      throw new NotFoundException('Comic Slug không tồn tại');
    }
    const { is_active, create_at, update_at, countryId, ...data } = comic;
    return data;
  }

  async setIsActiveComic(comic_id: number) {
    const comic = await this.checkComicExits(comic_id);
    const isActive = comic.is_active;
    const setComicActive = await this.prisma.comic.update({
      where: {
        id: comic_id,
      },
      data: {
        is_active: !isActive,
      },
    });

    if (setComicActive.is_active === false) {
      return {
        message: `set show comic ${setComicActive.title} thành công `,
      };
    } else {
      return {
        message: `set hide comic ${setComicActive.title} thành công `,
      };
    }
  }
}
