import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CountryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCountryDto: CreateCountryDto) {
    const countryName = await this.prisma.country.findUnique({
      where: { name: createCountryDto.name },
    });

    if (countryName) {
      throw new BadRequestException('Country đã tồn tại');
    }

    const countrySlug = await this.prisma.country.findUnique({
      where: { slug: createCountryDto.slug },
    });

    if (countrySlug) {
      throw new BadRequestException('Slug đã tồn tại');
    }

    const newCountry = await this.prisma.country.create({
      data: createCountryDto,
    });
    return {
      message: 'Thêm Country thành công',
      country: newCountry,
    };
  }

  async findAll() {
    const country = await this.prisma.country.findMany();
    return country;
  }

  async checkCountryExits(id: number) {
    const country = await this.prisma.country.findUnique({
      where: { id },
    });
    if (!country) {
      throw new NotFoundException('Country không tồn tại');
    }
    return country;
  }

  async update(id: number, updateCountryDto: UpdateCountryDto) {
    await this.checkCountryExits(id);
    const country = await this.prisma.country.update({
      where: { id: id },
      data: updateCountryDto,
    });

    return {
      message: 'Update Country thành công',
      country,
    };
  }

  async remove(id: number) {
    await this.checkCountryExits(id);
    const country = await this.prisma.country.delete({
      where: { id: id },
    });
    return {
      message: `Xóa thành công country có id ${country.id}`,
    };
  }
}
