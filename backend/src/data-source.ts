import { DataSource } from 'typeorm';
import { User } from './modules/user/domain/entities/user.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'treewar',
  password: 'treewar_password',
  database: 'treewar_db',
  synchronize: false,
  logging: true,
  entities: [User],
  migrations: ['src/migrations/*.ts'],
});
