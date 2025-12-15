export interface User {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
  created_at?: string;
}

export interface AuthState {
  user: User | null;
  error: string | null;
  session: any | null;
  isLoading: boolean;
  isRecovery: boolean;
}

export enum UserRoles {
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  CUSTOMER = 'customer',
  COMPANY_OWNER = 'company-owner',
}
