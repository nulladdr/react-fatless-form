import * as yup from "yup";

import { useForm } from "../hooks/useForm";
import { feedbackManager } from "./FeedbackManager";
import { validateSchema } from "./validation";

/**
 * Handles form submissions with validation, submission status tracking, 
 * and optional user feedback via toast notifications.
 *
 * This utility:
 * - Validates the form using the provided `yup` schema.
 * - Tracks submission status (`"submitting"`, `"success"`, `"error"`).
 * - Displays optional feedback via `feedbackManager` (e.g., toast).
 * - Allows developers to suppress feedback manually or customize messages.
 *
 * @template T - Form value type.
 * @template R - Response type from the submission handler.
 *
 * @param {ReturnType<typeof useForm<T>>} form - The form instance managing state and validation.
 * @param {yup.ObjectSchema<T>} schema - The Yup schema for validating form values.
 * @param {(values: T) => Promise<R>} onSubmit - Async function that performs the actual submission.
 *   - If successful, may return an object with `{ message?: string }`.
 *   - If an error occurs, it should `throw` an object with `{ message?: string }`.
 * @param {(result: R) => void} [onSuccess] - Optional callback executed after a successful submission.
 * @param {Object} [feedbackConfig] - Optional config to control feedback behavior.
 * @param {string} [feedbackConfig.successMessage] - Fallback success message. Defaults to `"Done!"`.
 * @param {string} [feedbackConfig.errorMessage] - Fallback error message. Defaults to `"An error occurred. Please try again."`.
 * @param {boolean} [feedbackConfig.showFeedback] - Whether to show toast feedback. Defaults to `true`.
 *   - If omitted, feedback is enabled by default.
 *   - If an empty object is passed (`{}`), feedback is disabled and a warning is logged.
 *
 * @returns {Promise<void>} A Promise that resolves when submission is complete.
 *
 * @example
 * // Default behavior
 * await handleSubmit(form, schema, async (values) => {
 *   return { message: "Saved!" };
 * });
 *
 * @example
 * // Custom success message
 * await handleSubmit(form, schema, async (values) => {
 *   return {};
 * }, {
 *   successMessage: "Operation successful!"
 * });
 *
 * @example
 * // Custom error message
 * await handleSubmit(form, schema, async (values) => {
 *   throw { message: "API is down" };
 * }, {
 *   errorMessage: "Failed to save. Try later."
 * });
 *
 * @example
 * // Suppress feedback manually
 * await handleSubmit(form, schema, async (values) => {
 *   await api.save(values);
 * }, {
 *   showFeedback: false
 * });
 *
 * @example
 * // Suppress feedback via empty config
 * await handleSubmit(form, schema, async (values) => {
 *   return {};
 * }, {});
 * // Logs: "Warning: `feedbackConfig` should not be an empty object..."
 *
 * @example
 * // Specify the response type (R)
 * type ApiResponse = { id: string; message?: string };
 *
 * await handleSubmit<FormData, ApiResponse>(form, schema, async (values) => {
 *   const response = await api.submit(values);
 *   return response;
 * }, (result) => {
 *   console.log("Submitted successfully with ID:", result.id);
 * });
 *
 * @description
 * - Uses your `validateSchema()` helper for schema-based validation.
 * - Gracefully handles `success` and `error` messages with fallback logic.
 * - Supports typed `R` return types for safer downstream `onSuccess(result)` usage.
 */
export async function handleSubmit<T extends Record<string, any>, R = void>(
    form: ReturnType<typeof useForm<T>>,
    schema: yup.ObjectSchema<T>,
    onSubmit: (values: T) => Promise<R>,
    onSuccess?: (result: R) => void,
    feedbackConfig?: {
        successMessage?: string;
        errorMessage?: string;
        showFeedback?: boolean;
    },
) {
    const { values, updateSubmissionStatus, resetSubmissionStatus, validate, resetForm } = form;

    if (!validate(() => validateSchema(schema, values))) {
        console.warn("Validation failed, skipping submission");
        return;
    }

    // If feedbackConfig is provided but empty, warn the developer
    if (feedbackConfig && Object.keys(feedbackConfig).length === 0) {
        console.warn("Warning: `feedbackConfig` should not be an empty object. Defaulting to no feedback.");
        feedbackConfig = { showFeedback: false }; // Assume developer handles feedback manually
    }

    updateSubmissionStatus("submitting");

    try {
        const result = await onSubmit(values);
        updateSubmissionStatus("success");

        // Show feedback if either `feedbackConfig` is omitted or `showFeedback` is not explicitly set to false
        if (!feedbackConfig || feedbackConfig.showFeedback !== false) {
            const successMessage =
                (typeof result === "object" && result !== null && "message" in result
                    ? (result as any).message
                    : undefined) ||
                feedbackConfig?.successMessage ||
                "Done!";

            if (successMessage) {
                feedbackManager.addFeedback(successMessage, {
                    variant: "success",
                    onClose: resetSubmissionStatus,
                });
            }
        }

        resetForm();
        onSuccess?.(result);
    } catch (error: any) {
        updateSubmissionStatus("error");

        if (!feedbackConfig || feedbackConfig.showFeedback !== false) {
            const errorMessage =
                error?.message ||
                error?.data?.message ||
                feedbackConfig?.errorMessage ||
                "An error occurred. Please try again.";

            if (errorMessage) {
                feedbackManager.addFeedback(errorMessage, {
                    variant: "error",
                    onClose: resetSubmissionStatus,
                });
            }
        }
    }
}
