import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { HashPasswordService } from 'src/utils/hashpassword.service';

@Module({
  controllers: [UserController],
  providers: [UserService, HashPasswordService],
  exports: [UserService],
})
export class UserModule {}
