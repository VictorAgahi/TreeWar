import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: "L'email fourni n'est pas valide." })
  @IsNotEmpty({ message: "L'email est requis." })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: 'Le mot de passe est requis.' })
  @MinLength(6, {
    message: 'Le mot de passe doit faire au moins 6 caractères.',
  })
  password!: string;
}
