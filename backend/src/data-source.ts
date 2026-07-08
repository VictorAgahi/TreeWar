import { DataSource } from 'typeorm';
import { User } from './modules/user/domain/entities/user.entity';
import { Tree } from './modules/tree/domain/entities/tree.entity';
import { Transaction } from './modules/transaction/domain/entities/transaction.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'InvesTree',
  password: 'InvesTree_password',
  database: 'InvesTree_db',
  synchronize: false,
  logging: true,
  entities: [User, Tree, Transaction],
  migrations: ['src/migrations/*.ts'],
});
