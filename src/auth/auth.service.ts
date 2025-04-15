import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRegisterDto } from './dto/create-register.dto';
import { UserService } from 'src/module/user/user.service';
import { HashPasswordService } from 'src/utils/hashpassword.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly hashPasswordService: HashPasswordService,
  ) {}

  async register(createRegisterDto: CreateRegisterDto) {
    return this.userService.handlRegister(createRegisterDto);
  }

  async validateUser(email: string, pass: string): Promise<any> {
    try {
      const user = await this.userService.findUserByEmail(email);
      if (!user) {
        return null;
      }
      const isValid = await this.hashPasswordService.comparePassword(
        pass,
        user.password,
      );
      if (!isValid) {
        return null;
      }
      const { password, ...result } = user;
      return result;
    } catch (error) {
      console.error('Error in validateUser:', error);
      throw new Error('Error validating user');
    }
  }

  async login(user: any) {
    const payload = { email: user.email, id: user.id, role: user.role };
    const data = {
      username: user.username,
      role: user.role,
    };

    const token = await this.createRefreshToken(payload);

    const { access_token, refresh_token } = token;

    return {
      access_token,
      refresh_token,
      data,
    };
  }

  private async createRefreshToken(payload: {
    id: number;
    email: string;
    role: string;
  }) {
    const access_token = this.jwtService.sign(payload);

    const refresh_token = await this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION'),
    });

    await this.userService.createRefreshToken(payload.id, refresh_token);

    return { access_token, refresh_token };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const user = await this.userService.findUserByEmail(payload.email);

      if (user && user.refresh_tokens === refreshToken) {
        const data = {
          username: user.username,
          role: user.role,
        };
        const newToken = await this.createRefreshToken({
          id: user.id,
          email: user.email,
          role: user.role,
        });

        const { access_token, refresh_token } = newToken;
        return {
          access_token,
          refresh_token,
          data,
        };
      } else {
        throw new NotFoundException('RefreshToken không tồn tại');
      }
    } catch {
      throw new NotFoundException('RefreshToken không tồn tại');
    }
  }

  async signOut(userId: number) {
    return await this.userService.createRefreshToken(userId, null);
  }
}
