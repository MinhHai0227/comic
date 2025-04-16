import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { transactionStatus } from '@prisma/client';

@Injectable()
export class TransactionService {
  constructor(private readonly prisma: PrismaService) {}

  async createTransaction(createTransactionDto: CreateTransactionDto) {
    const transaction = await this.prisma.transaction.create({
      data: createTransactionDto,
    });
    return {
      message: ' Tạo transaction thành công',
      data: transaction,
    };
  }

  async checkTransactionExits(id: number) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
    });
    if (!transaction) {
      throw new NotFoundException('Giao dịc không tồn tại');
    }
    return transaction;
  }

  async transactionSuccess(id: number) {
    await this.checkTransactionExits(id);
    const transaction = await this.prisma.transaction.update({
      where: { id },
      data: {
        status: transactionStatus.completed,
      },
    });
    return transaction;
  }

  async transactionError(id: number) {
    await this.checkTransactionExits(id);
    const transaction = await this.prisma.transaction.update({
      where: { id },
      data: {
        status: transactionStatus.failed,
      },
    });
    return transaction;
  }
}
