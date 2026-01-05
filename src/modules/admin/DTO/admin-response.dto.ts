class AdminResponseDTO {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  verified: boolean;
  occupation?: string;
  companyName?: string;
  phone?: string;
  language?: string;
  role: string;
  isSuperAdmin: boolean;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

class AdminListResponseDTO {
  id: string;
  username: string;
  email: string;
  fullName?: string;
  role: string;
  isSuperAdmin: boolean;
}
export { AdminResponseDTO, AdminListResponseDTO };
