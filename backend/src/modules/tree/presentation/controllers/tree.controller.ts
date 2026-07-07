import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { TreeService } from '../../application/tree.service';
import { CreateTreeDto } from '../dtos/create-tree.dto';
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

  @Get(':id')
  async getTree(@Param('id') id: string) {
    return this.treeService.getTreeById(id);
  }

  @Post()
  async createTree(@Body() dto: CreateTreeDto) {
    return this.treeService.createTree(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/buy')
  async buyTree(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: BuyTreeDto,
  ) {
    return this.treeService.buyTree(id, user.sub, dto.amount, dto.newName);
  }
}
