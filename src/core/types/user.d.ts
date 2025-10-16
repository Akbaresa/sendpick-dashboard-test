export interface User {
  id_user: number;
  name: string;
  email: string;
  email_verified_at?: string | null;
  role_id: number;
  created_at: string;
  updated_at: string;
}
export interface Role {
  id_role: number;
  role_name: 'admin' | 'dispatcher' | 'driver';
}
