import { IsString } from 'class-validator';

class ArtistsRoleDTO {
  @IsString()
  identifier: string;

  @IsString()
  title: string;
}
export { ArtistsRoleDTO };
