import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

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

  @ApiProperty({ type: 'string', example: 'dasd734234-13456-fghtrd-67876' })
  @IsString()
  @IsNotEmpty()
  attendatIt: string;

  @ApiProperty({
    type: 'string',
    example: 'dasd734234-13456-fghtrd-67876',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;
}
