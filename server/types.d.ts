import { ZodError } from 'zod';

declare global {
  interface ZodError<T = any> {
    errors: { message: string; path?: (string | number)[] }[];
  }

  namespace Express {
    interface Request {
      apiKey?: any;
      user?: any;
    }
  }
}

export {};
