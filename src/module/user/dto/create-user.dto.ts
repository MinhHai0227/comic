import { userRole } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Username không được để trống' })
  username: string;

  @IsNotEmpty({ message: 'Email không được để trống' })
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  email: string;

  @IsNotEmpty({ message: 'Password không được để trống' })
  @MinLength(6, { message: 'Password phải có ít nhất 6 kí tự' })
  password: string;

  @IsOptional()
  avatar: string;

  @IsOptional()
  role: userRole;

  @IsOptional()
  @Transform(({ value }) => parseInt(value) || 0)
  current_coin: number;

  @IsOptional()
  refresh_tokens: string;
}
