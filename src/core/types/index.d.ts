export interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T;
}

interface AuthUser {
  name: string;
  email: string;
  token: string;
  expired_at: string;
}
interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => void;
  checkToken: () => Promise<AuthUser>;
}