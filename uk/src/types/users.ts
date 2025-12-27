export interface User {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  password_hash: string | null;
  auth_provider: 'google' | 'credentials';
  google_id: string | null;
  email_verified: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  auth_provider: 'credentials' | 'google';
  google_id?: string;
  image?: string;
}
