import {
  IsOptional,
  IsString,
  IsEnum,
  IsBoolean,
  IsPhoneNumber,
} from 'class-validator';

export class UserDTO {
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
  @IsEnum(['admin', 'user', 'mod', 'guest'])
  roles?: 'admin' | 'user' | 'mod' | 'guest';

  @IsOptional()
  @IsBoolean()
  is_admin?: boolean;
}
