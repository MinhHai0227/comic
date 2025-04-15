import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateRegisterDto } from './dto/create-register.dto';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { Public } from 'src/decorator/public.decorator';
import { GoogleAuthGuard } from './passport/google-auth.guard';
import { Response } from 'express';
import { Roles } from 'src/decorator/roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  register(@Body() createRegisterDto: CreateRegisterDto) {
    return this.authService.register(createRegisterDto);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Public()
  @Post('refresh-token')
  async refreshToken(
    @Request() req,
    @Body('refresh_token') refreshToken: string,
  ) {
    const newAccessToken = await this.authService.refreshToken(refreshToken);
    return newAccessToken;
  }

  @Get('google')
  @Public()
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {}

  @Public()
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@Request() req, @Res() res: Response) {
    const user = req.user;
    const { access_token, refresh_token, data } =
      await this.authService.login(user);
    return res.json({
      access_token,
      refresh_token,
      data,
    });
  }

  @Post('signout')
  async signOut(@Request() req) {
    await this.authService.signOut(req.user.id);
    return {
      message: 'Bạn đã đăng xuất thành công',
    };
  }

  @Roles('admin') 
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
