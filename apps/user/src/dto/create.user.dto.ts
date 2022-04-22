import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  document: string;
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsString()
  @IsNotEmpty()
  password: string;
  @IsString()
  @IsNotEmpty()
  type: string;
}