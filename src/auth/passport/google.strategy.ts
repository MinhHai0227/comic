import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { HashPasswordService } from 'src/utils/hashpassword.service';
import { UserService } from 'src/module/user/user.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly hashPassWordService: HashPasswordService,
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLINET_ID') ?? '',
      clientSecret: configService.get<string>('GOOGLE_CLINET_SECRET') ?? '',
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL') ?? '',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    const { emails, id } = profile;
    const hash = await this.hashPassWordService.hasdPassword(id);
    let user = await this.userService.findUserByEmail(emails[0].value);
    if (!user) {
      user = await this.userService.createUserByGoogle(
        profile.displayName,
        emails[0].value,
        hash,
      );
    }
    done(null, user);
  }
}
