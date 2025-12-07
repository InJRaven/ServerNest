class AdminResponseDTO {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  emailVerified: boolean;
  occupation?: string;
  companyName?: string;
  phone?: string;
  language?: string;
  roles: string;
  isSuperAdmin: boolean;
  is_deleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

class AdminListResponseDTO {
  id: string;
  username: string;
  email: string;
  fullName?: string;
  roles: string;
  isSuperAdmin: boolean;
}
export { AdminResponseDTO, AdminListResponseDTO };
