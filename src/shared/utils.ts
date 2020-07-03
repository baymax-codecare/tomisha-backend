import { ValueTransformer } from 'typeorm';
import * as bcrypt from 'bcryptjs';

export function hash(str: string): string {
  return bcrypt.hash(str, 10);
}

export class BoolTransformer implements ValueTransformer {
  public to(value: boolean): number {
    return value ? 1 : 0;
  }
  public from(value: number): boolean {
    return !!value;
  }
}

export class JsonTransformer<T> implements ValueTransformer {
  constructor(private readonly defaultValue?: T) {}

  public from(value?: string | null): T | undefined {
    if (typeof value === "undefined" || value === null) {
      return this.defaultValue;
    }

    try {
      return JSON.parse(value);
    } catch (e) {
      return this.defaultValue;
    }
  }

  public to(value?: T | null): string | undefined {
    if (typeof value === "undefined" || value === null) {
      value = this.defaultValue;
    }

    if (typeof value === "undefined" || value === null) {
      return;
    }

    return JSON.stringify(value);
  }
}