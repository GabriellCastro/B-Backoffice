import * as jwt from 'jsonwebtoken';
import {
  IGenerateToken,
  ITokenAuthenticationProvider,
  IVerifyToken,
} from 'src/@core/application/gateways/providers/token/token.provider.interface';

export class JWTAuthenticationProvider implements ITokenAuthenticationProvider {
  public generateToken({ payload, secret, expiresIn }: IGenerateToken): string {
    return jwt.sign(payload, secret, {
      subject: payload.id as string,
      expiresIn,
    });
  }

  public verifyToken({ token, secret }: IVerifyToken): any {
    return jwt.verify(token, secret);
  }
}
