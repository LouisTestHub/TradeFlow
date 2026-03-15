import { NextResponse } from 'next/server';

export function apiError(message: string, status: number = 400, details?: unknown) {
  return NextResponse.json(
    {
      error: message,
      status,
      timestamp: new Date().toISOString(),
      ...(details ? { details } : {}),
    },
    { status }
  );
}

export function apiNotFound(entity: string = 'Resource') {
  return apiError(`${entity} not found`, 404);
}

export function apiUnauthorized() {
  return apiError('Unauthorized', 401);
}

export function apiServerError(error: unknown) {
  console.error('[API Error]', error);
  return apiError('Internal server error', 500);
}
