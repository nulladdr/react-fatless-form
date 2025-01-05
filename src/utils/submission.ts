import * as yup from "yup";

import { useForm } from "../hooks/useForm";
import { feedbackManager } from "./FeedbackManager";
import { validateSchema } from "./validation";

/**
 * A utility function for handling form submissions with validation, submission status updates, 
 * and optional user feedback via toast notifications.
 *
 * This function streamlines form submissions by integrating:
 * - Validation handling.
 * - Status updates for submission stages ("submitting", "success", "error").
 * - Conditional feedback notifications.
 *
 * @template T - The type of the form values.
 *
 * @param {ReturnType<typeof useForm<T>>} form - The form object returned by the `useForm` hook, 
 * which manages form state, submission status, and reset logic.
 *
 * @param {yup.ObjectSchema<T>} schema - A `yup` schema to validate the form values. The schema 
 * defines the shape, type, and constraints for the form data.
 *
 * @param {(values: T) => Promise<void>} onSubmit - An asynchronous callback that performs 
 * the submission logic, receiving the validated form values.
 *
 * @param {string} [successMessage="Done!"] - A message displayed to the user when the submission 
 * is successful. Defaults to "Done!" if no message is provided.
 *
 * @param {boolean} [showFeedback=true] - Determines whether feedback notifications are displayed. 
 * Defaults to `true`. If set to `false`, the burden of resetting the submission status 
 * to "idle" falls to the developer.
 *
 * @returns {Promise<void>} A Promise that resolves after the submission process is complete.
 *
 * @example
 * // Defining a schema using `yup`
 * import * as yup from 'yup';
 *
 * const schema = yup.object({
 *     username: yup.string().required("Username is required").min(3, "Username must be at least 3 characters"),
 *     email: yup.string().email("Invalid email format").required("Email is required"),
 *     password: yup.string().required("Password is required").min(8, "Password must be at least 8 characters"),
 * });
 *
 * @example
 * // Using handleSubmit with schema-based validation
 * import { useForm } from 'react-fatless-form';
 * 
 * const form = useForm<FormValues>({ username: "", email: "", password: ""});
 * 
 * const handleFormSubmit = async (event: React.FormEvent) => {
 *     event.preventDefault();
 * 
 *     await handleSubmit(
 *         form,
 *         schema,
 *         async (values) => {
 *             const result = await api.submitData(values);
 *             if (!result.ok) throw result; // Remember to throw errors
 *         },
 *         "Submission successful!"
 *     );
 * };
 *
 * @example
 * // Example with feedback disabled
 * import { useForm, feedbackManager } from "react-fatless-form";
 * 
 * // Defining a schema using `yup`
 * import * as yup from 'yup';
 *
 * const schema = yup.object({
 *     username: yup.string().required("Username is required").min(3, "Username must be at least 3 characters"),
 *     email: yup.string().email("Invalid email format").required("Email is required"),
 *     password: yup.string().required("Password is required").min(8, "Password must be at least 8 characters"),
 * });
 * 
 * const form = useForm<FormValues>({ username: "", email: "", password: ""});
 * 
 * const handleFormSubmit = async (event: React.FormEvent) => {
 *     event.preventDefault();
 * 
 *     await handleSubmit(
 *         form,
 *         schema,
 *         async (values) => {
 *             const result = await api.submitData(values);
 *             if (result.not.ok) throw result // Remember to throw
 *         },
 *         "Submission successful!",
 *         false // Disable feedback
 *     );
 * 
 *     // Custom feedback handling
 *     feedbackManager.addFeedback("Submission successful!", {
 *         type: "toast",
 *         variant: "success",
 *         autoDismiss: true,
 *         duration: 5000,
 *         onClose: () => form.resetSubmissionStatus(), // Ensure form submission status resets to "idle"
 *     });
 * };
 *
 * @description
 * - **Schema-Based Validation:** 
 *   - Validation is performed using the `validateSchema` utility under the hood, leveraging the provided `yup` schema.
 *   - Validation errors are automatically mapped to the form's error state, ensuring they are accessible in the UI.
 * 
 * - **Feedback Management:** 
 *   - When `showFeedback` is `true` (default), `displayToast` is used to notify users and reset the form submission status.
 *   - If `showFeedback` is `false`, the form's submission status (`"success"` or `"error"`) remains until explicitly reset using `form.resetSubmissionStatus`.
 *
 * - **Why Resetting Submission Status Is Important:**
 *   - Leaving the form in a `"success"` or `"error"` state can cause issues when using `useForm` in multiple places. For example, submission-related logic tied to `"idle"` won't execute if the form never returns to the `"idle"` state.
 *   - Developers can handle feedback flexibly (e.g., with custom UI or `feedbackManager`) but must ensure `form.resetSubmissionStatus` is called to reset the form's state.
 */
export async function handleSubmit<T extends Record<string, any>>(
    form: ReturnType<typeof useForm<T>>,
    schema: yup.ObjectSchema<T>,
    onSubmit: (values: T) => Promise<void>,
    successMessage: string = "Done!",
    showFeedback: boolean = true
) {
    const { values, updateSubmissionStatus, resetSubmissionStatus, validate, resetForm } = form;

    if (!validate(() => validateSchema(schema, values))) {
        console.warn("Validation failed, skipping submission");
        return;
    }

    updateSubmissionStatus("submitting");

    try {
        await onSubmit(values);
        updateSubmissionStatus("success");

        if (showFeedback) {
            feedbackManager.addFeedback(successMessage, { variant: "success", onClose: resetSubmissionStatus });
        }

        resetForm()
    } catch (error) {
        console.error("Submission error:", error);
        updateSubmissionStatus("error");

        if (showFeedback) {
            feedbackManager.addFeedback("Application error.", { variant: "error", onClose: resetSubmissionStatus });
        }
    }
}
