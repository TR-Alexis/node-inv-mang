export interface CreateMovementDto {
  type: 'IN' | 'OUT' | 'ADJUSTMENT';
  quantity: number;
  note?: string;
}

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

const isPositiveInteger = (value: unknown): value is number =>
  typeof value === 'number' && Number.isInteger(value) && value > 0;

export const validateCreateMovementPayload = (payload: unknown): CreateMovementDto => {
  if (typeof payload !== 'object' || payload === null) {
    throw new Error('Request body must be an object');
  }

  const body = payload as Record<string, unknown>;

  if (!isNonEmptyString(body.type)) {
    throw new Error('Movement type is required');
  }

  if (!['IN', 'OUT', 'ADJUSTMENT'].includes(body.type.toUpperCase())) {
    throw new Error('Movement type must be one of IN, OUT, or ADJUSTMENT');
  }

  if (!isPositiveInteger(body.quantity)) {
    throw new Error('Movement quantity must be a positive integer');
  }

  const movement: CreateMovementDto = {
    type: body.type.toUpperCase() as CreateMovementDto['type'],
    quantity: body.quantity,
  };

  if (isNonEmptyString(body.note)) {
    movement.note = body.note.trim();
  }

  return movement;
};
