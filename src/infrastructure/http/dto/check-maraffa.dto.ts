import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber } from 'class-validator';

export class CheckMaraffaDto {
  @ApiProperty()
  @IsArray()
  @IsNumber({}, { each: true })
  deck: number[];

  @ApiProperty()
  @IsNumber()
  suit: number;

  @ApiProperty()
  @IsNumber()
  value: number;

  @ApiProperty()
  @IsNumber()
  trump: number;
}
