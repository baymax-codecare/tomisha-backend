import * as bcrypt from 'bcryptjs';

export function hash(str: string): string {
  return bcrypt.hashSync(str, bcrypt.genSaltSync(10));
}

export function compareHash(str1: string, str2: string) {
  return bcrypt.compareSync(str1, str2);
}

export function filterObject(obj = {}, filter = Boolean) {
  const output = {};
  for (const key in obj) {
    if (filter(obj[key])) {
      output[key] = obj[key];
    }
  }
  return output;
}

export function getExpiresAt(sec: number): string {
  return new Date(Date.now() + sec * 1000).toUTCString();
}

export function generateSlug() {
  return Math.round(Date.now() + Math.random() * 100000) + '';
}
