import { UserMetadata } from '@supabase/supabase-js';

export interface User {
  id: string;
  email: string;
  user_metadata: UserMetadata;
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
