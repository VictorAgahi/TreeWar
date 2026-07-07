import {
  Body,
  Controller,
  Post,
  Get,
  Patch,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../../application/user.service';
import { RegisterDto } from '../dtos/register.dto';
import { LoginDto } from '../dtos/login.dto';
import { UpdateUsernameDto } from '../dtos/update-username.dto';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../../../common/decorators/current-user.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.userService.register(registerDto);
    return {
      message: 'Utilisateur créé avec succès',
      userId: user.id,
      username: user.username,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const accessToken = await this.userService.login(loginDto);
    return {
      accessToken,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@CurrentUser() user: JwtPayload) {
    return this.userService.getUserById(user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('username')
  async updateUsername(
    @CurrentUser() user: JwtPayload,
    @Body() updateDto: UpdateUsernameDto,
  ) {
    return this.userService.updateUsername(user.sub, updateDto.username);
  }

  @Get('leaderboard/most-trees')
  async getTopByTrees() {
    return this.userService.getTopUsersByTreeCount(10);
  }

  @Get('leaderboard/total-value')
  async getTopByTotalValue() {
    return this.userService.getTopUsersByTotalTreeValue(10);
  }

  @Get('leaderboard/most-expensive-tree')
  async getTopByExpensiveTree() {
    return this.userService.getTopUsersByMostExpensiveTree(10);
  }
}
