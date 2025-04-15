import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { PanigationUserDto } from './dto/panigation-user.dto';
import { Roles } from 'src/decorator/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { storage } from 'src/utils/upload.config';
import { UpdateUserDto } from './dto/update_user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles('admin')
  @Get()
  fetchAll(@Query() query: PanigationUserDto) {
    return this.userService.fetchAll(query);
  }

  @Get(':id')
  findOne(@Request() req) {
    return this.userService.checkUserExis(req.user.id);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', storage))
  uploadAvatar(@Request() req, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Vui lòng chọn file');
    }
    return this.userService.uploadAvatar(req.user.id, file);
  }

  @Patch(':id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Roles('admin')
  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deleteUser(id);
  }
}
