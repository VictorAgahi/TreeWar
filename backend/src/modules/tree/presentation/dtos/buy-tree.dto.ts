import {
  IsNumber,
  Min,
  Max,
  IsString,
  IsOptional,
  MaxLength,
} from 'class-validator';

export class BuyTreeDto {
  @IsString()
  @IsOptional()
  treeId?: string;

  @IsNumber()
  @Min(1)
  amount!: number;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  newName?: string;

  @IsNumber()
  @Min(-90)
  @Max(90)
  lat!: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  lng!: number;
}
