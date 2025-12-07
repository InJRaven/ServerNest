import {
  IsOptional,
  IsString,
  IsEnum,
  IsBoolean,
  IsPhoneNumber,
} from 'class-validator';

export class AdminDTO {
  @IsOptional()
  @IsString()
  first_name?: string;

  @IsOptional()
  @IsString()
  last_name?: string;

  @IsOptional()
  @IsString()
  full_name?: string;

  @IsOptional()
  @IsString()
  occupation?: string;

  @IsOptional()
  @IsString()
  company_name?: string;

  @IsOptional()
  @IsPhoneNumber(undefined)
  phone?: string;

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @IsEnum(['admin', 'manager', 'mod', 'guest'])
  roles?: 'admin' | 'manager' | 'mod' | 'guest';

  @IsOptional()
  @IsBoolean()
  is_super_admin?: boolean;

  @IsOptional()
  @IsBoolean()
  is_deleted?: boolean;
}
