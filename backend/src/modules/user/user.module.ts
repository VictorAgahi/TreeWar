import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import * as fs from 'fs';
import * as path from 'path';
import { User } from './domain/entities/user.entity';
import { UserRepository } from './infrastructure/repositories/user.repository';
import { UserService } from './application/user.service';
import { UserController } from './presentation/controllers/user.controller';
import { JwtStrategy } from '../../common/strategies/jwt.strategy';
import { TransactionModule } from '../transaction/transaction.module';

const privateKey = fs.readFileSync(
  path.join(process.cwd(), 'keys/private.pem'),
  'utf8',
);
const publicKey = fs.readFileSync(
  path.join(process.cwd(), 'keys/public.pem'),
  'utf8',
);

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      privateKey,
      publicKey,
      signOptions: {
        algorithm: 'RS256',
        expiresIn: '1h',
      },
      verifyOptions: {
        algorithms: ['RS256'],
      },
    }),
    TransactionModule,
  ],
  controllers: [UserController],
  providers: [UserRepository, UserService, JwtStrategy],
  exports: [UserService],
})
export class UserModule {}
