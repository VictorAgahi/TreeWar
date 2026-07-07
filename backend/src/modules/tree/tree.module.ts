import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tree } from './domain/entities/tree.entity';
import { TreeRepository } from './infrastructure/repositories/tree.repository';
import { TreeService } from './application/tree.service';
import { TreeController } from './presentation/controllers/tree.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Tree])],
  providers: [TreeRepository, TreeService],
  controllers: [TreeController],
  exports: [TreeService],
})
export class TreeModule {}
