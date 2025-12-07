import { AdminEntity } from '@entities';
import { AdminListResponseDTO, AdminResponseDTO } from '@modules/server/DTO';

class AdminMapper {
  toResponseDTO(entity: AdminEntity): AdminResponseDTO {
    return {
      id: entity.id,
      username: entity.username,
      email: entity.email,
      firstName: entity.first_name,
      lastName: entity.last_name,
      fullName: `${entity.first_name} ${entity.last_name}`,
      emailVerified: entity.email_verified,
      occupation: entity.occupation,
      companyName: entity.company_name,
      phone: entity.phone,
      language: entity.language,
      roles: entity.roles,
      isSuperAdmin: entity.is_super_admin,
      is_deleted: entity.is_deleted,
      createdAt: entity.createdAt?.toISOString(),
    };
  }

  toListResponseDTO(entity: AdminEntity): AdminListResponseDTO {
    return {
      id: entity.id,
      username: entity.username,
      email: entity.email,
      fullName: `${entity.first_name} ${entity.last_name}`,
      roles: entity.roles,
      isSuperAdmin: entity.is_super_admin,
    };
  }

  toListResponseDTOList(entities: AdminEntity[]): AdminListResponseDTO[] {
    return entities.map((e) => this.toListResponseDTO(e));
  }
}

export { AdminMapper };
