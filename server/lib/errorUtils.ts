import { ZodError } from 'zod';

export function getZodErrors(err: unknown) {
    if (!err) return null;
    // zod exposes 'issues' as the array of errors
    if ((err as any).issues) return (err as any).issues;
    if (err instanceof ZodError) return err.issues;
    return null;
}

export function formatErrorForResponse(err: unknown) {
    const z = getZodErrors(err);
    if (z) return z;
    return (err && (err as any).message) ? { message: (err as any).message } : { error: String(err) };
}
