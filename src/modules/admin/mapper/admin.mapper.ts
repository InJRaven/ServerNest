import { Admin } from '@AdminEntities';
import { AdminListResponseDTO, AdminResponseDTO } from '../DTO';

class AdminMapper {
  toResponseDTO(entity: Admin): AdminResponseDTO {
    const assignment = entity.roleAssignments?.find(
      (a) => a.isActive && !a.revokedAt,
    );
    const role = assignment?.role?.name ?? '';

    const isSuperAdmin = Boolean(assignment?.role?.isSuperAdmin);
    return {
      id: entity.id,
      username: entity.username,
      email: entity.email,
      firstName: entity.firstName,
      lastName: entity.lastName,
      fullName: `${entity.firstName} ${entity.lastName}`,
      verified: entity.verified,
      occupation: entity.occupation,
      companyName: entity.company_name,
      phone: entity.phone,
      language: entity.language,
      role,
      isSuperAdmin,
      isDeleted: entity.isDeleted,
      createdAt: entity.createdAt?.toISOString(),
    };
  }

  toListResponseDTO(entity: Admin): AdminListResponseDTO {
    const assignment = entity.roleAssignments?.find(
      (a) => a.isActive && !a.revokedAt,
    );
    const role = assignment?.role?.name ?? '';

    const isSuperAdmin = Boolean(assignment?.role?.isSuperAdmin);
    return {
      id: entity.id,
      username: entity.username,
      email: entity.email,
      fullName: `${entity.firstName} ${entity.lastName}`,
      role,
      isSuperAdmin,
    };
  }

  toListResponseDTOList(entities: Admin[]): AdminListResponseDTO[] {
    return entities.map((e) => this.toListResponseDTO(e));
  }
}

export { AdminMapper };
