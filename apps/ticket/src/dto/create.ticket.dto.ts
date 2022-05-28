import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class CreateTicketDto {
  @ApiProperty({ type: 'string', example: 'Example ticket description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ type: 'string', example: 'Type Example' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ type: 'string', example: 'Example ticket status' })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty({ type: 'string', example: 'Example ticket title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ type: 'string', example: 'Example ticket situation' })
  @IsString()
  @IsNotEmpty()
  situation: string;

  @ApiProperty({ type: 'string', example: 'Example ticket title' })
  @ValidateIf((value) => typeof value.comments !== 'undefined')
  @IsArray()
  @IsNotEmpty()
  comments: string[];

  @ApiProperty({ type: 'string', example: 'Example deviceId' })
  @IsString()
  @IsNotEmpty()
  deviceId: string;

  @ApiProperty({ type: 'string', example: 'dasd734234-13456-fghtrd-67876' })
  @IsString()
  @IsNotEmpty()
  attendantId: string;

  @ApiProperty({
    type: 'string',
    example: 'dasd734234-13456-fghtrd-67876',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;
}
