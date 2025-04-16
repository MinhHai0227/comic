import { BadRequestException, Injectable } from '@nestjs/common';
import { CoinService } from 'src/module/coin/coin.service';
import { TransactionService } from 'src/module/transaction/transaction.service';
import { UserService } from 'src/module/user/user.service';
import * as crypto from 'crypto';
import axios from 'axios';
import { NotificationService } from 'src/module/notification/notification.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MomoService {
  private readonly accessKey = 'F8BBA842ECF85';
  private readonly secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
  private readonly partnerCode = 'MOMO';
  private readonly requestType = 'payWithMethod';
  private readonly lang = 'vi';

  constructor(
    private readonly userService: UserService,
    private readonly coinService: CoinService,
    private readonly transactionService: TransactionService,
    private readonly notificationService: NotificationService,
    private readonly configService: ConfigService,
  ) {}

  async createPaymentRequest(user_id: number, coin_id: number) {
    const extraData = '';
    const orderInfo = 'pay with MoMo';
    const ipnUrl = this.configService.get<string>('MOMO_IPN_URL');
    const redirectUrl = this.configService.get<string>('MOMO_REDIRECT_URL');

    await this.userService.checkUserExis(user_id);
    const coin = await this.coinService.checkCoinExits(coin_id);

    const transaction = await this.transactionService.createTransaction({
      userId: user_id,
      coinId: coin_id,
      coin_amount: coin.coin_amount,
      price: coin.price,
    });

    const rawSignature = `accessKey=${this.accessKey}&amount=${coin.price}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${transaction.data.id}&orderInfo=${orderInfo}&partnerCode=${this.partnerCode}&redirectUrl=${redirectUrl}&requestId=${transaction.data.id}&requestType=${this.requestType}`;
    const signature = this.generateSignature(rawSignature);

    const requestBody = {
      partnerCode: this.partnerCode,
      partnerName: 'Test',
      storeId: 'MomoTestStore',
      requestId: transaction.data.id,
      amount: coin.price,
      orderId: transaction.data.id,
      orderInfo: orderInfo,
      redirectUrl: redirectUrl,
      ipnUrl: ipnUrl,
      lang: this.lang,
      requestType: this.requestType,
      autoCapture: true,
      extraData: extraData,
      signature: signature,
    };

    try {
      const response = await axios.post(
        'https://test-payment.momo.vn/v2/gateway/api/create',
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      return response.data;
    } catch (error) {
      throw new BadRequestException('Lỗi thanh toán MOMO');
    }
  }

  private generateSignature(rawSignature: string): string {
    return crypto
      .createHmac('sha256', this.secretKey)
      .update(rawSignature)
      .digest('hex');
  }

  async handleIPN(query: any) {
    const { orderId, resultCode } = query;

    try {
      if (resultCode === 0) {
        const transaction = await this.transactionService.transactionSuccess(
          parseInt(orderId),
        );
        await this.userService.paymentUpdatecoin(
          transaction.userId,
          transaction.coin_amount,
        );
        await this.notificationService.notifiPaymetSusses(
          transaction.userId,
          transaction.price,
          transaction.coin_amount,
        );
      } else {
        const transaction = await this.transactionService.transactionError(
          parseInt(orderId),
        );
        await this.notificationService.notifiPaymetError(transaction.userId);
      }
    } catch (error) {
      throw new BadRequestException('Lỗi Update Transaction');
    }

    return {
      message: 'Thông báo thanh toán từ MoMo đã được xử lý thành công',
    };
  }
}
