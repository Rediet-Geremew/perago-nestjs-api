import { IsString, IsNotEmpty, IsOptional, IsUUID, ValidateIf } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreatePositionDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  @IsUUID('4', { message: 'Parent ID must be a valid UUID' })
  @Transform(({ value }) => value === '' ? null : value)
  parentId?: string | null;
}