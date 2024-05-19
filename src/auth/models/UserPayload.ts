export interface UserPayload {
  sub: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePic: string;
  iat?: number;
  exp?: number;
}
