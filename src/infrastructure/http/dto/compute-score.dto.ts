import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNumber, IsString } from 'class-validator';

export class ComputeScoreDto {
  @ApiProperty()
  @IsArray()
  @IsNumber({}, { each: true })
  trick: number[];

  @ApiProperty()
  @IsNumber()
  trump: number;

  @ApiProperty()
  @IsString()
  mode: string;

  @ApiProperty()
  @IsArray()
  @IsNumber({}, { each: true })
  teamACards: number[];

  @ApiProperty()
  @IsArray()
  @IsBoolean({ each: true })
  isSuitFinished: boolean[];
}
