import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from 'nestjs-redis';
import { VerificationType } from './type/verification-type.enum';

interface TokenPayload {
  id: string;
  type: VerificationType;
  expiresIn: number; // In second
  receiverId?: string;
  senderId?: string;
  data?: any;
  notificationId?: number;
  direct?: boolean;
}

interface ValidateTokenAttrs {
  type?: VerificationType;
  receiverId?: string;
  senderId?: string;
}

@Injectable()
export class VerificationService {
  constructor(
    private jwtService: JwtService,
    private redisService: RedisService,
    private configService: ConfigService,
  ) {}

  private callbackHref = this.configService.get('webAppDomain') + 'token';
  private verificationHref = this.configService.get('domain') + 'verification/redirect?token='

  // Create new token url and invalidate all old tokens that are associated with a unique key
  public async createTokenUrl(payload: TokenPayload): Promise<string> {
    const uniqueKey = payload.type + ':' + payload.id;

    const token = this.jwtService.sign(payload, { expiresIn: payload.expiresIn, noTimestamp: true });

    const redisClient = await this.redisService.getClient();

    await redisClient.set(uniqueKey, token, 'EX', payload.expiresIn);

    if (payload.direct) {
      return `${this.callbackHref}?type=${payload.type}&token=${token}`;
    }

    return  this.verificationHref + token;
  }

  // Validate the token generated by createToken
  public async validateToken(token: string, attrs?: ValidateTokenAttrs): Promise<TokenPayload> {
    const decoded: TokenPayload = this.jwtService.verify(token);

    if (
      decoded?.id &&
      (!attrs?.type || decoded.type === attrs.type) &&
      (!attrs?.receiverId || decoded.receiverId === attrs.receiverId) &&
      (!attrs?.senderId || attrs.senderId === decoded.senderId)
    ) {
      const redisClient = await this.redisService.getClient();

      const uniqueKey = decoded.type + ':' + decoded.id;
      const savedToken = await redisClient.get(uniqueKey);

      if (savedToken === token) {
        redisClient.del(uniqueKey);

        return decoded;
      }
    }

    throw new BadRequestException('The token URL is invalid or has been expired');
  }

  public async redirectToWebApp(token: string): Promise<string> {
    const decoded: TokenPayload = this.jwtService.verify(token);

    if (decoded?.id && decoded.type) {
      const redisClient = await this.redisService.getClient();

      const uniqueKey = decoded.type + ':' + decoded.id;
      const savedToken = await redisClient.get(uniqueKey);
      if (savedToken) {
        return this.callbackHref + `?type=${decoded.type}&token=${token}` + (decoded.notificationId ? `&notificationId=${decoded.notificationId}` : '');
      }
    }

    return this.callbackHref;
  }
}
