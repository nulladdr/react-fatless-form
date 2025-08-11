import * as yup from "yup";

/**
 * Creates a Yup-based resolver for handleSubmit.
 * Maintains backward compatibility for existing Yup users.
 * 
 * @template T - Form value type
 * @param {yup.ObjectSchema<T>} schema - Yup validation schema
 * @param {boolean} [abortEarly=false] - Stop validation at first error
 * @returns {(values: T) => Partial<Record<keyof T, string>>} Resolver function
 * 
 * @example
 * // Using with handleSubmit
 * import { yupResolver } from "./validation";
 * 
 * handleSubmit(
 *   form,
 *   yupResolver(schema),
 *   onSubmit
 * );
 */
export function yupResolver<T extends Record<string, any>>(
  schema: yup.ObjectSchema<T>,
  abortEarly: boolean = false
): (values: T) => Partial<Record<keyof T, string>> {
  return (values: T) => {
    try {
      schema.validateSync(values, { abortEarly });
      return {};
    } catch (validationError: any) {
      return validationError.inner.reduce((acc: Record<string, string>, err: any) => {
        if (err.path) acc[err.path] = err.message;
        return acc;
      }, {});
    }
  };
}

/**
 * Generic validation helper (optional - for direct usage)
 * 
 * @deprecated Prefer using resolver functions directly
 */
export function validateSchema<T extends Record<string, any>>(
  resolver: (values: T) => Partial<Record<keyof T, string>>,
  values: T
): Partial<Record<keyof T, string>> {
  return resolver(values);
}
