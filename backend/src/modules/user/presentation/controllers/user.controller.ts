import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { UserService } from '../../application/user.service';
import { RegisterDto } from '../dtos/register.dto';
import { LoginDto } from '../dtos/login.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.userService.register(registerDto);
    return {
      message: 'Utilisateur créé avec succès',
      userId: user.id,
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
}
