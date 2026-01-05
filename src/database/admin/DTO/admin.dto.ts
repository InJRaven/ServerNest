import {
  IsOptional,
  IsString,
  IsBoolean,
  IsPhoneNumber,
} from 'class-validator';

class AdminDTO {
  @IsOptional()
  @IsString()
  username?: string;

  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

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

  @IsString()
  roles: string;

  @IsOptional()
  @IsBoolean()
  super_admin?: boolean;

  @IsOptional()
  @IsBoolean()
  verified?: boolean;
}

class AdminRoleDTO {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isSuperAdmin?: boolean;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export { AdminDTO, AdminRoleDTO };
