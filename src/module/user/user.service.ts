import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { HashPasswordService } from 'src/utils/hashpassword.service';
import { CreateRegisterDto } from 'src/auth/dto/create-register.dto';
import { PanigationUserDto } from './dto/panigation-user.dto';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import * as fs from 'fs';
import { UpdateUserDto } from './dto/update_user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly hashPasswordService: HashPasswordService,
    private readonly configService: ConfigService,
  ) {}

  async findUserByEmail(email: string) {
    const user = this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new UnauthorizedException('User không tồn tại');
    }
    return user;
  }

  async handlRegister(createRegisterrDto: CreateRegisterDto) {
    const { username, email, password } = createRegisterrDto;
    const user = await this.findUserByEmail(email);
    const hashPass = await this.hashPasswordService.hasdPassword(password);

    if (user) {
      throw new BadRequestException('Email đã tồn tại');
    }

    const registerUser = await this.prisma.user.create({
      data: {
        username: username,
        email: email,
        password: hashPass,
      },
    });

    return {
      message: 'User đăng kí thành công',
      id: registerUser.id,
    };
  }

  async createRefreshToken(userId: number, refreshTonken: string | null) {
    return await this.prisma.user.update({
      where: { id: userId },
      data: {
        refresh_tokens: refreshTonken,
      },
    });
  }

  async createUserByGoogle(name: string, email: string, password: string) {
    return await this.prisma.user.create({
      data: {
        username: name,
        email: email,
        password: password,
      },
    });
  }

  async fetchAll(query: PanigationUserDto) {
    const { page, limit, search, role } = query;

    const skip = (page - 1) * limit;
    const users = await this.prisma.user.findMany({
      orderBy: { create_at: 'desc' },
      skip,
      take: limit,
      where: {
        AND: [
          {
            OR: [
              {
                username: {
                  contains: search,
                },
              },
              {
                email: {
                  contains: search,
                },
              },
            ],
          },
          role ? { role: role } : {},
        ],
      },
    });
    const data = users.map(
      ({ password, refresh_tokens, create_at, update_at, ...user }) => user,
    );
    const totalItem = await this.prisma.user.count();
    const totalPage = Math.ceil(totalItem / limit);
    const totalItemPerPage = limit;
    const currentPage = page;
    const prevPage = page > 1 ? page - 1 : 1;
    const nextPage = page < totalPage ? page + 1 : totalPage;
    return {
      data,
      totalItem,
      totalPage,
      totalItemPerPage,
      currentPage,
      prevPage,
      nextPage,
    };
  }

  async createUser(createUserDto: CreateUserDto) {
    const hashPass = await this.hashPasswordService.hasdPassword(
      createUserDto.password,
    );
    const user = await this.findUserByEmail(createUserDto.email);
    if (user) {
      throw new BadRequestException('Email đã tồn tại');
    }
    const registerUser = await this.prisma.user.create({
      data: {
        username: createUserDto.username,
        email: createUserDto.email,
        password: hashPass,
        role: createUserDto.role,
      },
    });

    return {
      message: 'đăng kí Role thành công',
      id: registerUser.id,
    };
  }

  async checkUserExis(userId) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new NotFoundException('User  không tồn tại');
    }

    const { password, refresh_tokens, create_at, update_at, ...userActive } =
      user;

    return userActive;
  }

  async uploadAvatar(userId: number, file: Express.Multer.File) {
    const user = await this.checkUserExis(userId);

    if (user && user.avatar) {
      const fileAvatar = user.avatar.split('/uploadfile/')[1];
      const oldAvatarPath = path.join(
        __dirname,
        '..',
        '..',
        '..',
        'uploadfile',
        fileAvatar,
      );
      try {
        if (fs.existsSync(oldAvatarPath)) {
          fs.unlinkSync(oldAvatarPath);
        }
      } catch {
        throw new BadRequestException('Không thể xóa ảnh | Ảnh không tồn tại');
      }
    }
    const upload = await this.prisma.user.update({
      where: { id: userId },
      data: {
        avatar: `${this.configService.get<string>('FILE_UPLOAD')}/${file.filename}`,
      },
    });

    return {
      message: 'Upload avatar thành công',
      avatar: upload.avatar,
    };
  }

  async updateUser(userId: number, updateUserDto: UpdateUserDto) {
    await this.checkUserExis(userId);

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        username: updateUserDto.username,
      },
    });
    return {
      message: 'Update thành công',
      id: user.id,
    };
  }

  async deleteUser(userId: number) {
    const user = await this.checkUserExis(userId);

    if (user && user.avatar) {
      const fileAvatar = user.avatar.split('/uploadfile/')[1];
      const oldAvatarPath = path.join(
        __dirname,
        '..',
        '..',
        '..',
        'uploadfile',
        fileAvatar,
      );
      try {
        if (fs.existsSync(oldAvatarPath)) {
          fs.unlinkSync(oldAvatarPath);
        }
      } catch {
        throw new BadRequestException('Không thể xóa ảnh');
      }
    }
    await this.prisma.user.delete({
      where: { id: userId },
    });

    return {
      message: `Xóa thành công User có id ${user.id}`,
    };
  }

  async updatetotalPrice(user_id: number, price_coin: number) {
    const user = await this.checkUserExis(user_id);
    const checkTotalPrice = user.current_coin > price_coin;
    if (!checkTotalPrice) {
      throw new BadRequestException('bạn không đủ xu');
    }
    const updateTotal = await this.prisma.user.update({
      where: { id: user_id },
      data: {
        current_coin: {
          decrement: price_coin,
        },
      },
    });
    return {
      message: 'Update Total Coin thành công',
      data: updateTotal.current_coin,
    };
  }

  async paymentUpdatecoin(user_id: number, price_coin: number) {
    await this.checkUserExis(user_id);
    const updateTotal = await this.prisma.user.update({
      where: { id: user_id },
      data: {
        current_coin: {
          increment: price_coin,
        },
      },
    });
    return {
      message: 'Update Total Coin thành công',
      data: updateTotal.current_coin,
    };
  }
}
