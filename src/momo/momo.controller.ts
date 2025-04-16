import {
  BadRequestException,
  Body,
  Controller,
  Logger,
  ParseIntPipe,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { MomoService } from './momo.service';
import { Public } from 'src/decorator/public.decorator';

@Controller('momo')
export class MomoController {
  constructor(private readonly momoService: MomoService) {}

  @Post('create')
  createPaymentRequest(
    @Request() req,
    @Body('coin_id', ParseIntPipe) coin_id: number,
  ) {
    return this.momoService.createPaymentRequest(req.user.id, coin_id);
  }

  @Public()
  @Post('ipn')
  async handleIPN(@Body() ipnData: any) {
    try {
      const result = await this.momoService.handleIPN(ipnData);
      return { resultCode: '0', message: 'Success' };
    } catch (error) {
      throw new BadRequestException('Error processing IPN');
    }
  }
}
