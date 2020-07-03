import * as fs from 'fs';
import { getMetadataArgsStorage } from 'typeorm';
import { join } from 'path';

export default () => {
  const { __basedir } = global as any;

  const isProd = process.env.NODE_ENV === 'production';

  const TMP_UPLOAD_DIR_NAME = 'tmp';
  const ASSET_DIR_NAME = 'assets';
  const UPLOAD_DIR = process.env.APP_UPLOAD_DIR || './public';
  const uploadDir = UPLOAD_DIR.startsWith('.') ? join(__basedir, UPLOAD_DIR) : UPLOAD_DIR;
  const assetDir = uploadDir + '/' + ASSET_DIR_NAME;
  const tmpDir = uploadDir + '/' + TMP_UPLOAD_DIR_NAME;

  try {
    fs.readdirSync(UPLOAD_DIR);
  } catch (_) {
    throw new Error('APP_UPLOAD_DIR not found');
  }

  fs.mkdir(assetDir, (): void => {});
  fs.mkdir(tmpDir, (): void => {});

  return {
    isProd,
    port: parseInt(process.env.APP_PORT, 10) || 7600,
    uploadDir,
    assetDir,
    assetDirName: ASSET_DIR_NAME,
    tmpDir,
    tmpDirName: TMP_UPLOAD_DIR_NAME,
    auth: {
      secret: process.env.AUTH_SECRET,
      maxAge: +process.env.AUTH_MAX_AGE || 24 * 60 * 60 * 1000,
    },
    typeorm: {
      type: 'postgres',
      host: process.env.TYPEORM_HOST || 'localhost',
      port: parseInt(process.env.TYPEORM_PORT, 10) || 1433,
      username: process.env.TYPEORM_USERNAME,
      password: process.env.TYPEORM_PASSWORD,
      database: process.env.TYPEORM_DATABASE,
      logging: isProd ? ['error'] : ['query', 'error'],
      logger: 'advanced-console',
      entities: getMetadataArgsStorage().tables.map(tbl => tbl.target),
      synchronize: false,
      options: {
        encrypt: false,
        enableArithAbort: false,
      },
      autoLoadEntities: true,
    },
    redis: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT, 10) || 6379,
      db: parseInt(process.env.REDIS_DB, 10) || 0,
      password: process.env.REDIS_PASSWORD,
    },
    mail: {
      transport: {
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        ignoreTLS: process.env.MAIL_SECURE !== 'TLS',
        secure: process.env.MAIL_SECURE === 'SSL',
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      },
      defaults: {
        from: process.env.MAIL_FROM,
      },
    },
  };
};
