import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  Max,
  IsOptional,
} from 'class-validator';

export class CreateTreeDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsNumber()
  @Min(-90)
  @Max(90)
  lat!: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  lng!: number;

  @IsNumber()
  @Min(1)
  @IsOptional()
  price?: number;
}
