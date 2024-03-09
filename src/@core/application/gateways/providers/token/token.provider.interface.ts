export interface IGenerateToken {
  payload: {
    id?: string;
    name?: string;
    email?: string;
    role?: string;
  };
  secret: string;
  expiresIn: string | number;
}

export interface IVerifyToken {
  token: string;
  secret: string;
}

export interface ITokenAuthenticationProvider {
  generateToken({ payload, secret, expiresIn }: IGenerateToken): string;
  verifyToken({ token, secret }: IVerifyToken): any;
}
