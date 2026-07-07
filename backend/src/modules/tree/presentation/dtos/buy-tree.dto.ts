import {
  IsNumber,
  Min,
  IsString,
  IsOptional,
  MaxLength,
} from 'class-validator';

export class BuyTreeDto {
  @IsNumber()
  @Min(1)
  amount!: number;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  newName?: string;
}
