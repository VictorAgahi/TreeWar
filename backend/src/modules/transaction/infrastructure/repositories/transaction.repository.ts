import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Transaction } from '../../domain/entities/transaction.entity';

@Injectable()
export class TransactionRepository extends Repository<Transaction> {
  constructor(dataSource: DataSource) {
    super(Transaction, dataSource.createEntityManager());
  }
}
