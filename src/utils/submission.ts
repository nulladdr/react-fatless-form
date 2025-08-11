import { useForm } from "../hooks/useForm";
import { feedbackManager } from "./FeedbackManager";

/**
 * Handles form submissions with validation, submission status tracking, 
 * and optional user feedback via toast notifications.
 *
 * This utility:
 * - Validates the form using the provided resolver function
 * - Tracks submission status (`"submitting"`, `"success"`, `"error"`)
 * - Displays optional feedback via `feedbackManager` (e.g., toast)
 * - Allows developers to suppress feedback manually or customize messages
 *
 * @template T - Form value type.
 * @template R - Response type from the submission handler.
 *
 * @param {ReturnType<typeof useForm<T>>} form - The form instance managing state and validation
 * @param {(values: T) => Partial<Record<keyof T, string>>} resolver - Validation function that returns errors object
 * @param {(values: T) => Promise<R>} onSubmit - Async submission handler
 * @param {(result: R) => void} [onSuccess] - Optional success callback
 * @param {Object} [feedbackConfig] - Optional feedback configuration
 * @param {string} [feedbackConfig.successMessage] - Fallback success message
 * @param {string} [feedbackConfig.errorMessage] - Fallback error message
 * @param {boolean} [feedbackConfig.showFeedback] - Toggle feedback visibility
 *
 * @returns {Promise<void>} 
 *
 * @example - Using with Yup
 * import { yupResolver } from "react-fatless-form";
 * 
 * await handleSubmit(
 *   form,
 *   yupResolver(schema),
 *   async (values) => { ... }
 * );
 *
 * @example - Using with Zod
 * const zodResolver = (values) => {
 *   try {
 *     schema.parse(values);
 *     return {};
 *   } catch (error) {
 *     return error.flatten().fieldErrors;
 *   }
 * };
 * 
 * await handleSubmit(form, zodResolver, ...);
 */
export async function handleSubmit<T extends Record<string, any>, R = void>(
  form: ReturnType<typeof useForm<T>>,
  resolver: (values: T) => Partial<Record<keyof T, string>>,
  onSubmit: (values: T) => Promise<R>,
  onSuccess?: (result: R) => void,
  feedbackConfig?: {
    successMessage?: string;
    errorMessage?: string;
    showFeedback?: boolean;
  },
) {
  const { values, updateSubmissionStatus, resetSubmissionStatus, validate, resetForm } = form;

  if (!validate(() => resolver(values))) {
    console.warn("Validation failed, skipping submission");
    return;
  }

  // Handle empty feedbackConfig warning
  if (feedbackConfig && Object.keys(feedbackConfig).length === 0) {
    console.warn("Warning: `feedbackConfig` should not be an empty object. Defaulting to no feedback.");
    feedbackConfig = { showFeedback: false };
  }

  updateSubmissionStatus("submitting");

  try {
    const result = await onSubmit(values);
    updateSubmissionStatus("success");

    // Show success feedback
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

    // Show error feedback
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
