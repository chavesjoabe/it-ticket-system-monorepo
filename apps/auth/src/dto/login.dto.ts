import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ type: 'string' })
  @IsString()
  @IsNotEmpty()
  document: string;

  @ApiProperty({ type: 'string' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
