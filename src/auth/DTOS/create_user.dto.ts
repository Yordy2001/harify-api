export interface CreateUserDto {
  email: string;
  password: string;
  role: string[];
  tenant_id: string;
}
