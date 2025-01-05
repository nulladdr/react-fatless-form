import { useCallback, useState } from "react";

export interface UseForm<T> {
    values: T;
    errors: Partial<Record<keyof T, string>>;
    touched: Partial<Record<keyof T, boolean>>;
    submissionStatus: "idle" | "submitting" | "success" | "error";
    setFieldValue: (field: keyof T, value: T[keyof T]) => void;
    setFieldArrayValue: (field: keyof T, value: string | string[]) => void;
    setFieldError: (field: keyof T, error: string) => void;
    setFieldTouched: (field: keyof T, touched: boolean) => void;
    validate: (validateFn: (values: T) => Partial<Record<keyof T, string>>) => boolean;
    resetForm: () => void;
    updateSubmissionStatus: (status: "idle" | "submitting" | "success" | "error") => void;
    resetSubmissionStatus: () => void;
}

export interface FormState<T> {
    values: T;
    errors: Partial<Record<keyof T, string>>;
    touched: Partial<Record<keyof T, boolean>>;
}

export type FormSubmissionStatus = "idle" | "submitting" | "success" | "error";

/**
 * A custom React hook for managing form state, validation, submission lifecycle, and interactions.
 *
 * This hook provides a robust solution for handling form values, validation, errors, submission status, 
 * and user interactions. It is designed to be flexible and reusable for various form use cases.
 *
 * @template T - The shape of the form's values, defining keys and their respective types.
 *
 * @param {T} initialValues - The initial state of the form's values, determining the default structure of the form.
 *
 * @returns {object} A collection of state and functions for managing the form:
 * 
 * **State:**
 * - **values** (`T`): The current state of the form's values.
 * - **errors** (`Partial<Record<keyof T, string>>`): An object storing validation errors for each field.
 * - **touched** (`Partial<Record<keyof T, boolean>>`): An object tracking whether a field has been interacted with.
 * - **submissionStatus** (`"idle" | "submitting" | "success" | "error"`): The current status of the form submission.
 *
 * **Functions:**
 * - **setFieldValue** (`(field: keyof T, value: T[keyof T]) => void`): Updates the value of a specific field.
 * - **setFieldArrayValue** (`(field: keyof T, value: string | string[]) => void`): Sets the value of a field as a string or an array of strings.
 * - **setFieldError** (`(field: keyof T, error: string) => void`): Sets an error message for a specific field.
 * - **setFieldTouched** (`(field: keyof T, touched: boolean) => void`): Marks a field as touched or untouched.
 * - **validate** (`(validateFn: (values: T) => Partial<Record<keyof T, string>>) => boolean`): 
 *   Validates the form using a custom validation function.
 *   - `validateFn` receives the current `values` and should return an object with field-specific error messages.
 *   - Returns `true` if validation passes (no errors), otherwise `false`.
 * - **resetForm** (`() => void`): Resets the form's values, errors, and touched fields to their initial state.
 * - **updateSubmissionStatus** (`(status: "idle" | "submitting" | "success" | "error") => void`): Updates the `submissionStatus` to reflect the current state of submission.
 * - **resetSubmissionStatus** (`() => void`): Resets the `submissionStatus` to `"idle"`. Useful for reusing the form or clearing transient submission states.
 *
 * **Design Philosophy:**
 * - **Separation of Concerns**: Core responsibilities like state updates and validation are modular and reusable.
 * - **Flexibility**: Provides developers full control over the submission and validation process.
 * - **Future-Proofing**: Allows for evolving workflows without tightly coupling submission logic to form state management.
 *
 * @example
 * ```tsx
 * const form = useForm({ username: "", age: 0 });
 *
 * const validateForm = (values) => {
 *     const errors = {};
 *     if (!values.username) errors.username = "Username is required";
 *     if (values.age <= 0) errors.age = "Age must be positive";
 *     return errors;
 * };
 *
 * const handleSubmit = async () => {
 *     if (!form.validate(validateForm(form.values))) {
 *         console.warn("Validation failed");
 *         return;
 *     }
 *     form.updateSubmissionStatus("submitting");
 *     try {
 *         await apiCall(form.values);
 *         form.updateSubmissionStatus("success");
 *     } catch (error) {
 *         console.error("Error during submission:", error);
 *         form.updateSubmissionStatus("error");
 *     }
 * };
 *
 * return (
 *     <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
 *         <input
 *             value={form.values.username}
 *             onChange={(e) => form.setFieldValue("username", e.target.value)}
 *         />
 *         {form.errors.username && <span>{form.errors.username}</span>}
 *         <button type="submit">Submit</button>
 *     </form>
 * );
 * ```
 */
export function useForm<T>(initialValues: T) {
    const [state, setState] = useState<FormState<T>>({
        values: initialValues,
        errors: {},
        touched: {},
    });
    const [submissionStatus, setSubmissionStatus] = useState<FormSubmissionStatus>("idle");

    const setFieldValue = useCallback((field: keyof T, value: T[keyof T]) => {
        setState((prev) => ({
            ...prev,
            values: { ...prev.values, [field]: value },
        }));
    }, []);

    const setFieldError = useCallback((field: keyof T, error: string) => {
        setState((prev) => ({
            ...prev,
            errors: { ...prev.errors, [field]: error },
        }));
    }, []);

    const setFieldArrayValue = useCallback(
        (field: keyof T, value: string | string[]) => {
            setState((prev) => ({
                ...prev,
                values: {
                    ...prev.values,
                    [field]: Array.isArray(value) ? value : [value],
                },
            }));
        },
        []
    );

    const setFieldTouched = useCallback((field: keyof T, touched: boolean) => {
        setState((prev) => ({
            ...prev,
            touched: { ...prev.touched, [field]: touched },
        }));
    }, []);

    /**
     * Validates the form's current values using a custom validation function.
     *
     * @description
     * The `validate` function allows developers to perform validation on the 
     * form's current `values` by providing a custom validation function (`validateFn`).
     * It updates the form's `errors` state based on the validation results and 
     * returns a boolean indicating whether the form is valid or not.
     *
     * **How It Works:**
     * - Accepts a `validateFn` that takes the form's current `values` as input.
     * - The `validateFn` should return an object where keys correspond to the 
     *   field names and values are the error messages for those fields.
     * - If the returned object has no keys (i.e., no errors), the form is considered valid.
     *
     * @param validateFn - A custom function to validate the form's current values. 
     *                     It should return a partial record of field keys and 
     *                     their corresponding error messages.
     *
     * @returns `true` if the form is valid (i.e., no validation errors); `false` otherwise.
     *
     * **Why is this flexible?**
     * - Developers can define their own validation rules, allowing for 
     *   diverse validation strategies (e.g., schema-based, field-specific, or conditional).
     * - Centralizes validation logic in a single reusable function for consistent behavior.
     *
     * **Usage in Workflows:**
     * This function is typically called before submitting the form to ensure that all 
     * fields meet the required validation criteria. For example, in a `handleSubmit` 
     * function, it can gate the submission process based on validation results.
     *
     * @example
     * ```tsx
     * const form = useForm(initialValues);
     *
     * const validateSchema = (values: MyFormValues): Partial<Record<keyof MyFormValues, string>> => {
     *     const errors: Partial<Record<keyof MyFormValues, string>> = {};
     *     if (!values.username) errors.username = "Username is required";
     *     if (values.age < 0) errors.age = "Age cannot be negative";
     *     return errors;
     * };
     *
     * const handleSubmit = async () => {
     *     if (!form.validate(() => validateSchema(form.values))) {
     *         console.warn("Form validation failed");
     *         return;
     *     }
     *     // Proceed with submission
     *     await onSubmit(form.values);
     * };
     *
     * return (
     *     <form onSubmit={handleSubmit}>
     *         <input
     *             value={form.values.username}
     *             onChange={(e) => form.setFieldValue("username", e.target.value)}
     *         />
     *         {form.errors.username && <span>{form.errors.username}</span>}
     *         <button type="submit">Submit</button>
     *     </form>
     * );
     * ```
     */
    const validate = useCallback(
        (validateFn: (values: T) => Partial<Record<keyof T, string>>) => {
            const errors = validateFn(state.values);
            setState((prev) => ({ ...prev, errors }));
            return Object.keys(errors).length === 0;
        },
        [state.values]
    );

    const resetForm = useCallback(() => {
        setState(() => ({
            values: initialValues,
            errors: {},
            touched: {},
        }));
    }, [initialValues]);

    const updateSubmissionStatus = useCallback((status: "idle" | "submitting" | "success" | "error") => {
        setSubmissionStatus(status);
    }, []);

    /**
     * Resets the `submissionStatus` state to `"idle"`.
     *
     * @description
     * This function is provided to allow developers explicit control over 
     * resetting the `submissionStatus` state. The `submissionStatus` tracks 
     * the form's submission lifecycle, transitioning between `"submitting"`, 
     * `"success"`, and `"error"` states. Resetting it to `"idle"` is particularly 
     * useful when preparing the form for reuse or clearing transient states after
     * a submission flow is complete.
     *
     * **Why is this not automatic?**
     * - **Flexibility**: Developers can choose when and how to reset the status, 
     *   which is crucial for scenarios where the status needs to persist longer 
     *   (e.g., showing success/error messages until user acknowledgement).
     * - **Future-Proofing**: By keeping the reset responsibility outside of 
     *   `handleSubmit`, this function accommodates workflows that may require 
     *   the status to remain unchanged for specific business logic or UI behavior.
     *
     * @example
     * ```tsx
     * const form = useForm(initialValues);
     *
     * const onSubmit = async (values: MyFormValues) => {
     *     // Handle form submission logic here
     *     console.log("Form submitted:", values);
     * };
     *
     * const handleUserAcknowledgement = () => {
     *     // Manually reset status after user interaction
     *     form.resetSubmissionStatus();
     * };
     *
     * return (
     *     <div>
     *         {form.submissionStatus === "success" && (
     *             <div>
     *                 <p>Form submitted successfully!</p>
     *                 <button onClick={handleUserAcknowledgement}>OK</button>
     *             </div>
     *         )}
     *     </div>
     * );
     * ```
     */
    const resetSubmissionStatus = useCallback(() => {
        setSubmissionStatus("idle");
    }, []);

    return {
        ...state,
        submissionStatus,
        setFieldValue,
        setFieldArrayValue,
        setFieldError,
        setFieldTouched,
        validate,
        resetForm,
        updateSubmissionStatus,
        resetSubmissionStatus,
    };
}
