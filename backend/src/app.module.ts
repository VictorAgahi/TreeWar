import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { TreeModule } from './modules/tree/tree.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { AppDataSource } from './data-source';

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options),
    UserModule,
    TreeModule,
    TransactionModule,
  ],
})
export class AppModule {}
