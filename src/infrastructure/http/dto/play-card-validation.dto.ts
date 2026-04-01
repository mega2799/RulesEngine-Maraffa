import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNumber } from 'class-validator';

export class PlayCardValidationDto {
  @ApiProperty()
  @IsArray()
  @IsNumber({}, { each: true })
  trick: number[];

  @ApiProperty()
  @IsNumber()
  card: number;

  @ApiProperty()
  @IsArray()
  @IsNumber({}, { each: true })
  userCards: number[];

  @ApiProperty()
  @IsBoolean()
  cardIsTrump: boolean;
}
