import { IsString } from 'class-validator';

export class SearchUserDto {
  @IsString()
  type: string;
}
