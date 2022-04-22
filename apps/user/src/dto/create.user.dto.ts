import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ type: 'string', example: 'José da Silva' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ type: 'string', example: '32112355643' })
  @IsString()
  @IsNotEmpty()
  document: string;

  @ApiProperty({ type: 'string', example: 'email@email.com' })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ type: 'string', example: 'Teste123' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ type: 'string', example: 'Test-Type' })
  @IsString()
  @IsNotEmpty()
  type: string;
}
