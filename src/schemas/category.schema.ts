export interface CreateCategoryDto {
  name: string;
}

export interface UpdateCategoryDto {
  name: string;
}

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

export const validateCreateCategoryPayload = (payload: unknown): CreateCategoryDto => {
  if (typeof payload !== 'object' || payload === null) {
    throw new Error('Request body must be an object');
  }

  const body = payload as Record<string, unknown>;
  if (!isNonEmptyString(body.name)) {
    throw new Error('Category name is required and must be a non-empty string');
  }

  return { name: body.name.trim() };
};

export const validateUpdateCategoryPayload = (payload: unknown): UpdateCategoryDto => {
  if (typeof payload !== 'object' || payload === null) {
    throw new Error('Request body must be an object');
  }

  const body = payload as Record<string, unknown>;
  if (body.name === undefined) {
    throw new Error('At least one updatable field is required');
  }

  if (!isNonEmptyString(body.name)) {
    throw new Error('Category name must be a non-empty string');
  }

  return { name: body.name.trim() };
};
