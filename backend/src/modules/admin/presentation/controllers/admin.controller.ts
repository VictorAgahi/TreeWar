import { Controller, Post, HttpCode } from '@nestjs/common';
import { AdminService } from '../../application/admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('seed')
  @HttpCode(200)
  async seedDatabase() {
    await this.adminService.seedDatabase();
    return { message: 'Base de données repeuplée avec succès.' };
  }
}
