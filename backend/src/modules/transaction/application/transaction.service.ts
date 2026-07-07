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

  async getTotalStats() {
    const creditsResult = (await this.transactionRepository
      .createQueryBuilder('tx')
      .select('SUM(tx.price)', 'totalCredits')
      .getRawOne()) as { totalCredits: string | number | null };

    const treesResult = (await this.transactionRepository
      .createQueryBuilder('tx')
      .select('COUNT(DISTINCT tx.itemId)', 'totalTrees')
      .where('tx.itemType = :type', { type: TransactionItemType.TREE })
      .getRawOne()) as { totalTrees: string | number | null };

    return {
      totalCredits: Number(creditsResult?.totalCredits) || 0,
      totalTrees: Number(treesResult?.totalTrees) || 0,
    };
  }
}
