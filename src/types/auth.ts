export type UserRole =
  | "viewer"
  | "registered"
  | "editor"
  | "admin"
  | "super_admin";

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
}
