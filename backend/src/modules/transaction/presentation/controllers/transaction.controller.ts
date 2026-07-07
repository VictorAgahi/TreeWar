import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { TransactionService } from '../../application/transaction.service';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../../../common/decorators/current-user.decorator';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMyTransactions(@CurrentUser() user: JwtPayload) {
    return this.transactionService.getMyTransactions(user.sub);
  }

  @Get('tree/:id')
  async getTreeTransactions(@Param('id') treeId: string) {
    return this.transactionService.getTreeTransactions(treeId);
  }
}
