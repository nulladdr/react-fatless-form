import * as yup from "yup";

/**
 * Validates a given schema against a set of values and returns validation errors if any.
 *
 * This utility function leverages the `yup` validation library to perform schema validation
 * and collects all validation errors into a single object for easier integration with form
 * validation workflows. The errors are keyed by the invalid field names, with each key's value
 * being the corresponding error message.
 *
 * @template T - The shape of the schema and values being validated.
 *
 * @param {yup.ObjectSchema<T>} schema - The Yup schema defining the validation rules for the input values.
 * @param {T} values - The set of values to be validated against the schema.
 *
 * @returns {Record<string, string>} An object containing validation errors, where:
 *  - The keys represent the paths (field names) of the invalid fields.
 *  - The values represent the error messages for each invalid field.
 *
 *  If no errors are found, an empty object is returned.
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
 * // Validate the schema
 * const errors = validateSchema(schema, values);
 * console.log(errors);
 * // Output:
 * // {
 * //   name: "Name is required",
 * //   age: "Must be at least 18"
 * // }
 *
 * @throws {Error} Will not throw an error, but will instead return validation errors as a structured object.
 */
export function validateSchema<T extends Record<string, any>>(schema: yup.ObjectSchema<T>, values: T): Partial<Record<keyof T, string>> {
    try {
        schema.validateSync(values, { abortEarly: false });
        return {};
    } catch (validationError: any) {
        return validationError.inner.reduce((acc: Record<string, string>, err: any) => {
            acc[err.path] = err.message;
            return acc;
        }, {});
    }
}
