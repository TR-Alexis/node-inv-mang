import { RequestHandler } from 'express';

import { AppError } from './error-handler';

export const notFoundHandler: RequestHandler = (request, _response, next) => {
  next(
    new AppError(
      404,
      'ROUTE_NOT_FOUND',
      `Route ${request.method} ${request.originalUrl} not found`,
    ),
  );
};
