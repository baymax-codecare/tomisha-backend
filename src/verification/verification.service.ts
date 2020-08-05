import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from 'nestjs-redis';
import { getExpiresAt } from 'src/shared/utils';

interface CreateTokenUrlOpts {
  prefix: string;
  key: string;
  payload: any;
  expiresIn: number;
  callbackHref: string;
}

interface ValidateTokenOpts {
  prefix: string;
  decodedKey: string;
  token: string;
}

@Injectable()
export class VerificationService {
  constructor(
    private jwtService: JwtService,
    private redisService: RedisService,
  ) {}

  public async createTokenUrl(opts: CreateTokenUrlOpts): Promise<string> {
    const { prefix, key, payload, expiresIn = 86400, callbackHref } = opts;

    const token = this.jwtService.sign(payload, { expiresIn, noTimestamp: true });

    const redisClient = await this.redisService.getClient();

    await redisClient.set(prefix + ':' + key, token, 'EX', expiresIn);

    const tokenUrl = `${callbackHref}?token=${token}&expiresAt=${encodeURIComponent(getExpiresAt(expiresIn))}`;

    return tokenUrl;
  }

  public async validateToken(opts: ValidateTokenOpts): Promise<any> {
    const { prefix, decodedKey, token } = opts;

    const decoded = this.jwtService.verify(token);

    if (decoded?.[decodedKey]) {
      const savedKey = prefix + ':' + decoded[decodedKey];

      const redisClient = await this.redisService.getClient();

      const savedToken = await redisClient.get(savedKey);

      if (savedToken === token) {
        redisClient.del(savedKey);

        return decoded;
      }
    }

    throw new BadRequestException('The token URL is invalid or has been expired');
  }
}
