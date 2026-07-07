import { DataSource } from 'typeorm';
import { User } from './modules/user/domain/entities/user.entity';
import { Tree } from './modules/tree/domain/entities/tree.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'treewar',
  password: 'treewar_password',
  database: 'treewar_db',
  synchronize: false,
  logging: true,
  entities: [User, Tree],
  migrations: ['src/migrations/*.ts'],
});
