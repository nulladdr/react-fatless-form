import * as yup from "yup";

/**
 * Validates a given schema against a set of values and returns validation errors if any.
 *
 * This function uses the `yup` validation library to check if the provided values conform 
 * to the given schema. It supports configurable error handling through the `abortEarly` option.
 *
 * - When `abortEarly` is `true`, validation stops at the first encountered error.
 * - When `abortEarly` is `false` (default), all validation errors are collected and returned.
 *
 * @template T - The shape of the schema and values being validated.
 *
 * @param {yup.ObjectSchema<T>} schema - The Yup schema defining validation rules.
 * @param {T} values - The object containing values to be validated.
 * @param {boolean} [abortEarly=false] - Whether to stop at the first validation error (`true`)
 * or collect all errors (`false`).
 *
 * @returns {Partial<Record<keyof T, string>>} An object containing validation errors, where:
 *  - Keys represent the field names with errors.
 *  - Values are the corresponding error messages.
 *  - If no errors are found, an empty object `{}` is returned.
 *
 * @example
 * // Define a schema
 * const schema = yup.object().shape({
 *   name: yup.string().required("Name is required"),
 *   age: yup.number().min(18, "Must be at least 18").required("Age is required"),
 * });
 *
 * // Example input values
 * const values = { name: "", age: 15 };
 *
 * // Validate with default behavior (collect all errors)
 * const errors = validateSchema(schema, values);
 * console.log(errors);
 * // Output:
 * // {
 * //   name: "Name is required",
 * //   age: "Must be at least 18"
 * // }
 *
 * @example
 * // Validate with abortEarly = true (stops at the first error)
 * const errors = validateSchema(schema, values, true);
 * console.log(errors);
 * // Output:
 * // { name: "Name is required" }
 *
 * @throws {Error} This function does not throw errors; instead, it returns a structured object
 * containing validation messages.
 */
export function validateSchema<T extends Record<string, any>>(
    schema: yup.ObjectSchema<T>, 
    values: T, 
    abortEarly: boolean = false // Default: collect all errors
): Partial<Record<keyof T, string>> {
    try {
        schema.validateSync(values, { abortEarly });
        return {};
    } catch (validationError: any) {
        return validationError.inner.reduce((acc: Record<string, string>, err: any) => {
            acc[err.path] = err.message;
            return acc;
        }, {});
    }
}
