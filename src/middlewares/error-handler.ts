import { ErrorRequestHandler } from 'express';

import { ApiErrorResponse } from '../types/api';

export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const errorHandler: ErrorRequestHandler = (
  error,
  _request,
  response,
  _next,
) => {
  const appError = error instanceof AppError ? error : null;
  const statusCode = appError?.statusCode ?? 500;
  const body: ApiErrorResponse = {
    error: {
      code: appError?.code ?? 'INTERNAL_SERVER_ERROR',
      message: appError?.message ?? 'Internal server error',
      ...(appError?.details === undefined ? {} : { details: appError.details }),
    },
  };

  if (statusCode >= 500) {
    console.error(error);
  }

  response.status(statusCode).json(body);
};
