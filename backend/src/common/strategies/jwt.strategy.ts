import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { UserRepository } from '../../modules/user/infrastructure/repositories/user.repository';

const publicKey = fs.readFileSync(
  path.join(process.cwd(), 'keys/public.pem'),
  'utf8',
);

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userRepository: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // Rejette automatiquement les tokens expirés
      secretOrKey: publicKey,
      algorithms: ['RS256'],
    });
  }

  async validate(payload: { sub: string; email: string }) {
    const user = await this.userRepository.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('Utilisateur introuvable ou supprimé.');
    }

    return { sub: user.id, email: user.email, username: user.username };
  }
}
