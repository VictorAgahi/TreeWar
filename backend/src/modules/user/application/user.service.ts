import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../infrastructure/repositories/user.repository';
import { RegisterDto } from '../presentation/dtos/register.dto';
import { LoginDto } from '../presentation/dtos/login.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.userRepository.findByEmail(
      registerDto.email,
    );
    if (existingUser) {
      throw new ConflictException('Un utilisateur avec cet email existe déjà.');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(registerDto.password, salt);

    // Generate random username: Company_XyZ123
    const randomString = Math.random().toString(36).substring(2, 8);
    const username = `Company_${randomString}`;

    return this.userRepository.save({
      email: registerDto.email,
      passwordHash,
      username,
    });
  }

  async login(loginDto: LoginDto): Promise<string> {
    const user = await this.userRepository.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Identifiants invalides.');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Identifiants invalides.');
    }

    const payload = { sub: user.id, email: user.email };
    return this.jwtService.signAsync(payload);
  }

  async getUserById(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new UnauthorizedException('Utilisateur non trouvé.');
    }
    // Ne pas renvoyer le hash du mot de passe
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...result } = user;
    return result;
  }

  async updateUsername(id: string, newUsername: string) {
    const existing = await this.userRepository.findByUsername(newUsername);
    if (existing && existing.id !== id) {
      throw new ConflictException('Ce pseudo est déjà utilisé.');
    }

    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new UnauthorizedException('Utilisateur non trouvé.');
    }

    user.username = newUsername;
    await this.userRepository.save(user);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...result } = user;
    return result;
  }

  async getTopUsersByTreeCount(limit: number = 10) {
    return this.userRepository.getTopUsersByTreeCount(limit);
  }

  async getTopUsersByTotalTreeValue(limit: number = 10) {
    return this.userRepository.getTopUsersByTotalTreeValue(limit);
  }

  async getTopUsersByMostExpensiveTree(limit: number = 10) {
    return this.userRepository.getTopUsersByMostExpensiveTree(limit);
  }
}
