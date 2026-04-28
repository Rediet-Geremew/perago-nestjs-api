import { IsString, IsOptional, IsUUID, ValidateIf } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdatePositionDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  @IsUUID('4', { message: 'Parent ID must be a valid UUID' })
  @Transform(({ value }) => value === '' ? null : value)
  parentId?: string | null;
}