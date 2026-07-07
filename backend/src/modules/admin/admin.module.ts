import { Module } from '@nestjs/common';
import { AdminController } from './presentation/controllers/admin.controller';
import { AdminService } from './application/admin.service';

@Module({
  imports: [],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
