import { IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class UpdateUsernameDto {
  @IsString()
  @MinLength(3, { message: 'Le pseudo doit faire au moins 3 caractères' })
  @MaxLength(20, { message: 'Le pseudo ne peut pas dépasser 20 caractères' })
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message:
      'Le pseudo ne peut contenir que des lettres, chiffres et underscores',
  })
  username!: string;
}
