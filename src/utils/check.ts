export function nonNull<T>(value: (T | null | undefined), message?: string): T {
  if (value === null || value === undefined) {
    throw error(`nonNull: ${message || 'value'}`);
  }
  return value;
}

export function nonNullNotZero(value: number, message: string): number {
  if (value === null || value === undefined || value === 0) {
    throw error(`nonNullNotZero: ${message}: ${value}`);
  }
  return value;
}

export function nonNullNotEmpty(value: (string | null | undefined), message?: string): string {
  if (value === null || value === undefined || !value.trim().length) {
    throw error(`nonNullNotEmpty: ${message || 'value'}`);
  }
  return value;
}

export function arrayNonNullNotEmpty<T>(value: T[], message: string, ...args: unknown[]): T[] {
  if (!value || !value.length) {
    console.error(message, value, ...args);
    throw message;
  }
  return value;
}

export function isOneOf<T>(value: T, values: (T | null)[], message: string): T;
export function isOneOf<T>(value: (T | null), values: (T | null)[], message: string): (T | null);

export function isOneOf<T>(value: T | null, values: (T | null)[], message: string): T | null {
  if (value === null) {
    if (!values.includes(value)) {
      throw error(`${message} is null for non-nullable type`);
    }
    return value;
  }
  if (!values.includes(value)) {
    throw error(`${message} '${value}' is not a valid value (valid values are: '${values}'`);
  }
  return value;
}

export function error(message: string, ...additional: unknown[]): Error {
  const error = new Error(message);
  console.error(error, ...additional);
  return error;
}
