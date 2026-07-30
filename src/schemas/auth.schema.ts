export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  name?: string;
}

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

export const validateLoginPayload = (payload: unknown): LoginDto => {
  if (typeof payload !== 'object' || payload === null) {
    throw new Error('Request body must be an object');
  }

  const body = payload as Record<string, unknown>;

  if (!isNonEmptyString(body.email)) {
    throw new Error('Email is required');
  }

  if (!isNonEmptyString(body.password)) {
    throw new Error('Password is required');
  }

  return {
    email: body.email.trim().toLowerCase(),
    password: body.password,
  };
};

export const validateRegisterPayload = (payload: unknown): RegisterDto => {
  if (typeof payload !== 'object' || payload === null) {
    throw new Error('Request body must be an object');
  }

  const body = payload as Record<string, unknown>;

  if (!isNonEmptyString(body.email)) {
    throw new Error('Email is required');
  }

  if (!isNonEmptyString(body.password)) {
    throw new Error('Password is required');
  }

  const dto: RegisterDto = {
    email: body.email.trim().toLowerCase(),
    password: body.password,
  };

  if (isNonEmptyString(body.name)) {
    dto.name = body.name.trim();
  }

  return dto;
};
