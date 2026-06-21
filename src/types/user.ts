export interface IUser {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  profileImage?: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isActive: boolean;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
}

export interface IUserRequest {
  id: string;
  email: string;
  username: string;
  role: string;
}

export interface IAuthPayload {
  email: string;
  password: string;
}

export interface IRegisterPayload {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}
