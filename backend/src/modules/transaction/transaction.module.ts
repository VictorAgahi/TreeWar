import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './domain/entities/transaction.entity';
import { TransactionService } from './application/transaction.service';
import { TransactionController } from './presentation/controllers/transaction.controller';
import { TransactionRepository } from './infrastructure/repositories/transaction.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction])],
  controllers: [TransactionController],
  providers: [TransactionService, TransactionRepository],
  exports: [TypeOrmModule, TransactionService, TransactionRepository],
})
export class TransactionModule {}
