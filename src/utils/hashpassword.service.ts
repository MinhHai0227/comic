import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashPasswordService {
  private readonly saltRounds = 6;

  async hasdPassword(password: string): Promise<string> {
    try {
      const salt = await bcrypt.genSalt(this.saltRounds);
      return bcrypt.hash(password, salt);
    } catch (error) {
      console.log(error);
      throw new Error('Unable to hash password');
    }
  }

  async comparePassword(
    plainPassword: string,
    hasdPassword: string,
  ): Promise<boolean> {
    try {
      return bcrypt.compare(plainPassword, hasdPassword);
    } catch (error) {
      console.log(error);
      throw new Error('Unable to compare passwords');
    }
  }
}
