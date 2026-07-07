import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './modules/user/domain/entities/user.entity';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'treewar',
      password: 'treewar_password',
      database: 'treewar_db',
      entities: [User],
      synchronize: false, // We'll use migrations
    }),
    UserModule,
  ],
})
export class AppModule {}
