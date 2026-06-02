export type AccessTokenPayload = {
  access_token: string;
  expires_in: string;
};

export type RefreshTokenPayload = {
  refresh_token: string;
  expires_in: string;
};

export interface IJwtDecodedToken {
  user_id: string;
  sub: string;
  user_role: string;
  identifier: string;
  iat: number;
  exp: number;
}
