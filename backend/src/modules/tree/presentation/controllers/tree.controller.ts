import { Controller, Get, Put, Body, Param, UseGuards } from '@nestjs/common';
import { TreeService } from '../../application/tree.service';

import { BuyTreeDto } from '../dtos/buy-tree.dto';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../../../common/decorators/current-user.decorator';

@Controller('tree')
export class TreeController {
  constructor(private readonly treeService: TreeService) {}

  @Get()
  async getAllTrees() {
    return this.treeService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMyTrees(@CurrentUser() user: JwtPayload) {
    return this.treeService.getTreesByOwner(user.sub);
  }

  @Get(':id')
  async getTree(@Param('id') id: string) {
    return this.treeService.getTreeById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('buy')
  async buyTree(@CurrentUser() user: JwtPayload, @Body() dto: BuyTreeDto) {
    return this.treeService.buyTree(
      user.sub,
      dto.amount,
      dto.lat,
      dto.lng,
      dto.newName,
      dto.treeId,
    );
  }
}
