import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { passportJwtSecret } from 'jwks-rsa';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { CognitoConfig } from 'src/shared/providers/aws/cognito/cognito.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authConfig: CognitoConfig) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      ignoreExpiration: false,

      audience: authConfig.clientId,

      issuer: authConfig.authority,

      algorithms: ['RS256'],

      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${authConfig.authority}/.well-known/jwks.json`,
      }),
    });
  }

  public async validate(payload: any) {
    return { idUsuario: payload.sub, email: payload.email };
  }
}
