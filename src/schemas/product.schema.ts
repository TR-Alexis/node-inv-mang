export interface ProductQueryParams {
  page: number;
  limit: number;
  search?: string;
  categoryId?: string;
}

export interface CreateProductDto {
  name: string;
  sku: string;
  description?: string;
  quantity?: number;
  categoryId?: string;
}

export interface UpdateProductDto {
  name?: string;
  sku?: string;
  description?: string;
  quantity?: number;
  categoryId?: string;
}

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

const isInteger = (value: unknown): value is number =>
  typeof value === 'number' && Number.isInteger(value);

const parseOptionalNumber = (value: unknown): number | undefined => {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? undefined : parsed;
  }

  return undefined;
};

export const validateProductQueryParams = (payload: unknown): ProductQueryParams => {
  const query = typeof payload === 'object' && payload !== null ? (payload as Record<string, unknown>) : {};

  const rawPage = parseOptionalNumber(query.page);
  const rawLimit = parseOptionalNumber(query.limit);

  const page = rawPage && rawPage > 0 ? rawPage : 1;
  const limit = rawLimit && rawLimit > 0 ? Math.min(rawLimit, 100) : 10;

  const result: ProductQueryParams = {
    page,
    limit,
  };

  if (isNonEmptyString(query.search)) {
    result.search = query.search.trim();
  }

  if (isNonEmptyString(query.categoryId)) {
    result.categoryId = query.categoryId.trim();
  }

  return result;
};

export const validateCreateProductPayload = (payload: unknown): CreateProductDto => {
  if (typeof payload !== 'object' || payload === null) {
    throw new Error('Request body must be an object');
  }

  const body = payload as Record<string, unknown>;

  if (!isNonEmptyString(body.name)) {
    throw new Error('Product name is required and must be a non-empty string');
  }

  if (!isNonEmptyString(body.sku)) {
    throw new Error('Product SKU is required and must be a non-empty string');
  }

  const quantity = parseOptionalNumber(body.quantity);
  if (quantity !== undefined && (!isInteger(quantity) || quantity < 0)) {
    throw new Error('Product quantity must be a non-negative integer');
  }

  const product: CreateProductDto = {
    name: body.name.trim(),
    sku: body.sku.trim(),
    quantity: quantity ?? 0,
  };

  if (isNonEmptyString(body.description)) {
    product.description = body.description.trim();
  }

  if (isNonEmptyString(body.categoryId)) {
    product.categoryId = body.categoryId.trim();
  }

  return product;
};

export const validateUpdateProductPayload = (payload: unknown): UpdateProductDto => {
  if (typeof payload !== 'object' || payload === null) {
    throw new Error('Request body must be an object');
  }

  const body = payload as Record<string, unknown>;
  const product: UpdateProductDto = {};

  if (body.name !== undefined) {
    if (!isNonEmptyString(body.name)) {
      throw new Error('Product name must be a non-empty string');
    }
    product.name = body.name.trim();
  }

  if (body.sku !== undefined) {
    if (!isNonEmptyString(body.sku)) {
      throw new Error('Product SKU must be a non-empty string');
    }
    product.sku = body.sku.trim();
  }

  if (body.description !== undefined) {
    if (body.description !== null && typeof body.description !== 'string') {
      throw new Error('Product description must be a string');
    }
    product.description = body.description === null ? undefined : String(body.description).trim();
  }

  if (body.quantity !== undefined) {
    const quantity = parseOptionalNumber(body.quantity);
    if (quantity === undefined || !isInteger(quantity) || quantity < 0) {
      throw new Error('Product quantity must be a non-negative integer');
    }
    product.quantity = quantity;
  }

  if (body.categoryId !== undefined) {
    if (body.categoryId !== null && !isNonEmptyString(body.categoryId)) {
      throw new Error('Product categoryId must be a non-empty string');
    }
    product.categoryId = body.categoryId === null ? undefined : String(body.categoryId).trim();
  }

  if (Object.keys(product).length === 0) {
    throw new Error('At least one updatable field is required');
  }

  return product;
};
