import { Injectable } from '@nestjs/common';
import { TransactionItemType } from '../domain/entities/transaction.entity';
import { TransactionRepository } from '../infrastructure/repositories/transaction.repository';

@Injectable()
export class TransactionService {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async getMyTransactions(userId: string) {
    return this.transactionRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      relations: { user: true },
    });
  }

  async getTreeTransactions(treeId: string) {
    return this.transactionRepository.find({
      where: { itemId: treeId, itemType: TransactionItemType.TREE },
      order: { createdAt: 'DESC' },
      relations: { user: true },
    });
  }
}
