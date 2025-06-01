import * as yup from "yup";

import { useForm } from "../hooks/useForm";
import { feedbackManager } from "./FeedbackManager";
import { validateSchema } from "./validation";

/**
 * Handles form submissions with validation, submission status updates, 
 * and optional user feedback via toast notifications.
 *
 * This utility function:
 * - **Validates** the form using the provided `yup` schema.
 * - **Updates submission status** (`"submitting"`, `"success"`, `"error"`).
 * - **Handles feedback messages** based on the provided `feedbackConfig`.
 * - **Allows developers to control feedback handling** by omitting `feedbackConfig` or setting `showFeedback: false`.
 *
 * @template T - The type of form values.
 *
 * @param {ReturnType<typeof useForm<T>>} form - The form object returned by `useForm`, which manages form state, validation, and submission status.
 * @param {yup.ObjectSchema<T>} schema - A `yup` schema to validate the form values.
 * @param {(values: T) => Promise<{ message?: string } | void>} onSubmit - An asynchronous callback that performs the submission logic. 
 *   - If successful, it may return an object containing `{ message?: string }` (e.g., a success message).
 *   - If an error occurs, it should throw an object with `{ message?: string }` for error handling.
 * @param {Object} [feedbackConfig] - Optional configuration for user feedback.
 * @param {string} [feedbackConfig.successMessage] - A custom success message. Defaults to `"Done!"` if not provided.
 * @param {string} [feedbackConfig.errorMessage] - A custom error message. Defaults to `"An error occurred. Please try again."` if not provided.
 * @param {boolean} [feedbackConfig.showFeedback] - Whether to show feedback messages. Defaults to `true`. 
 *   - If omitted, **feedback messages will still be shown**.
 *   - If `{}` (an empty object) is passed, a warning is logged, and no feedback will be displayed.
 *
 * @returns {Promise<void>} A Promise that resolves after submission is complete.
 *
 * @example
 * // 1️⃣ Default behavior (implicit feedback handling)
 * await handleSubmit(form, schema, async (values) => {
 *     const result = await api.submit(values);
 *     return { message: "Profile updated successfully!" };
 * });
 * // ✅ Uses "Profile updated successfully!" from API if available.
 * // ✅ Falls back to "Done!" if API does not provide a message.
 * // ✅ Displays errors automatically if API throws an error with a message.
 *
 * @example
 * // 2️⃣ Custom success message
 * await handleSubmit(form, schema, async (values) => {
 *     const result = await api.submit(values);
 *     return { message: "Profile updated successfully!" };
 * }, {
 *     successMessage: "Update complete!"
 * });
 * // ✅ Shows "Profile updated successfully!" from API if available.
 * // ✅ Falls back to "Update complete!" if API does not return a message.
 *
 * @example
 * // 3️⃣ Custom error message
 * await handleSubmit(form, schema, async (values) => {
 *     const result = await api.submit(values);
 *     if (!result.ok) throw { message: "Server is unreachable." };
 * }, {
 *     errorMessage: "Something went wrong. Try again later."
 * });
 * // ✅ Shows "Server is unreachable." if API throws an error with a message.
 * // ✅ Falls back to "Something went wrong. Try again later." if no error message is provided.
 *
 * @example
 * // 4️⃣ Disabling feedback (you handle feedback manually)
 * await handleSubmit(form, schema, async (values) => {
 *     const result = await api.submit(values);
 *     if (!result.ok) throw new Error("Server error");
 * }, {
 *     showFeedback: false
 * });
 * // ❌ No automatic feedback messages.
 * // ✅ You must handle success/error feedback manually.
 *
 * @example
 * // 5️⃣ Empty feedbackConfig (assumes you will handle feedback manually)
 * await handleSubmit(form, schema, async (values) => {
 *     await api.submit(values);
 * }, {});
 * // ⚠️ Logs a warning: "Warning: `feedbackConfig` should not be an empty object. Defaulting to no feedback."
 * // ❌ No automatic feedback messages.
 * // ✅ You must handle success/error feedback manually.
 *
 * @description
 * - **Schema-Based Validation:** 
 *   - Validation is performed using the `validateSchema` utility under the hood, leveraging the provided `yup` schema.
 *   - Validation errors are automatically mapped to the form's error state, ensuring they are accessible in the UI.
 * 
 * - If `feedbackConfig` is **omitted**, feedback will still be shown using API messages or default messages.
 * - If `feedbackConfig` is an **empty object (`{}`)**, a warning is logged, and no feedback will be shown.
 * - If `onSubmit` returns `{ message: string }`, that message takes precedence over `feedbackConfig.successMessage`.
 * - If an error is thrown with `{ message: string }`, that message takes precedence over `feedbackConfig.errorMessage`.
 */
export async function handleSubmit<T extends Record<string, any>>(
    form: ReturnType<typeof useForm<T>>,
    schema: yup.ObjectSchema<T>,
    onSubmit: (values: T) => Promise<{ message?: string } | void>,
    feedbackConfig?: {
        successMessage?: string;
        errorMessage?: string;
        showFeedback?: boolean;
    }
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
            const successMessage = result?.message || feedbackConfig?.successMessage || "Done!";
            if (successMessage) {
                feedbackManager.addFeedback(successMessage, { variant: "success", onClose: resetSubmissionStatus });
            }
        }

        resetForm();
    } catch (error: any) {
        updateSubmissionStatus("error");

        if (!feedbackConfig || feedbackConfig.showFeedback !== false) {
            const errorMessage = error?.message || error.data.message || feedbackConfig?.errorMessage || "An error occurred. Please try again.";
            if (errorMessage) {
                feedbackManager.addFeedback(errorMessage, { variant: "error", onClose: resetSubmissionStatus });
            }
        }
    }
}
