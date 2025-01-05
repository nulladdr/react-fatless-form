
export type FeedbackVariant = "info" | "success" | "error" | "warning";
export interface Feedback {
    id: number;
    message: string;
    type: "toast" | "alert";
    variant: FeedbackVariant;
    autoDismiss?: boolean;
    duration?: number;
    onClose?: () => void;
    isFadingOut: boolean;
}

interface FeedbackOptions {
    type?: "toast" | "alert";
    variant?: FeedbackVariant;
    autoDismiss?: boolean;
    duration?: number;
    onClose?: () => void;
}

class FeedbackManager {
    listeners = new Set<(feedbacks: Feedback[]) => void>();
    feedbacks: Feedback[] = [];
    timeouts = new Map<number, NodeJS.Timeout>();

    addFeedback = (message: string, options: FeedbackOptions = {}) => {
        const id = Date.now();
        const feedback: Feedback = {
            id,
            message,
            type: options.type || "toast",
            variant: options.variant || "info",
            autoDismiss: options.autoDismiss ?? true,
            duration: options.duration || 5000,
            onClose: options.onClose,
            isFadingOut: false,
        };

        this.feedbacks = [...this.feedbacks, feedback];
        this.notifyListeners();

        if (feedback.autoDismiss) {
            const timeout = setTimeout(() => this.startFadeOut(id), feedback.duration);
            this.timeouts.set(id, timeout);
        }
    };

    startFadeOut = (id: number) => {
        this.feedbacks = this.feedbacks.map((f) =>
            f.id === id ? { ...f, isFadingOut: true } : f
        );
        this.notifyListeners();

        const timeout = setTimeout(() => this.removeFeedback(id), 300);
        this.timeouts.set(id, timeout);
    };

    removeFeedback = (id: number) => {
        const feedback = this.feedbacks.find((f) => f.id === id);
        if (feedback?.onClose) feedback.onClose();

        this.feedbacks = this.feedbacks.filter((f) => f.id !== id);
        this.timeouts.delete(id);
        this.notifyListeners();
    };

    notifyListeners = () => {
        this.listeners.forEach((listener) => listener(this.feedbacks));
    };

    subscribe = (listener: (feedbacks: Feedback[]) => void) => {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    };
}

/**
 * FeedbackManager
 * 
 * A class for managing feedback notifications, such as toasts or alerts, with support for auto-dismissal, customizable durations, and fade-out animations.
 * This utility helps centralize feedback handling in applications, offering a subscription-based model for real-time updates.
 * 
 * ### Features:
 * - Supports feedback types: "toast" and "alert".
 * - Four visual variants: "info", "success", "error", and "warning".
 * - Auto-dismiss functionality with configurable durations.
 * - Handles fade-out animations before removal.
 * - Easy integration with UI through a FeedbackContainer component.
 * 
 * ### Usage:
 * 
 * #### Importing and Instantiating:
 * ```typescript
 * import { feedbackManager } from 'react-fatless-form';
 * ```
 * 
 * #### Adding Feedback:
 * ```typescript
 * feedbackManager.addFeedback("Operation successful!", {
 *   type: "toast",
 *   variant: "success",
 *   autoDismiss: true,
 *   duration: 5000,
 *   onClose: () => console.log("Feedback closed!"),
 * });
 * ```
 * 
 * #### Subscribing to Feedback Updates:
 * ```typescript
 * const unsubscribe = feedbackManager.subscribe((feedbacks) => {
 *   console.log("Current feedbacks:", feedbacks);
 * });
 * 
 * // Unsubscribe when no longer needed
 * unsubscribe();
 * ```
 * 
 * #### Mounting the FeedbackContainer:
 * The `FeedbackContainer` component listens for updates to feedback notifications and renders them appropriately.
 * Add it once to your application, typically in your app's root component.
 * 
 * ```tsx
 * import { FeedbackContainer } from 'react-fatless-form';
 * 
 * function App() {
 *   return (
 *     <div>
 *       <YourMainContent />
 *       <FeedbackContainer />
 *     </div>
 *   );
 * }
 * ```
 * 
 * `FeedbackContainer` uses `ReactDOM.createPortal` to render feedback notifications at the root of the `document.body`.
 * Ensure it is included in your component tree to visualize feedback.
 * 
 * #### Example Integration with UI:
 * ```tsx
 * import { feedbackManager } from 'react-fatless-form';
 * 
 * const App = () => {
 *   const handleClick = () => {
 *     feedbackManager.addFeedback("This is a success message!", {
 *       type: "toast",
 *       variant: "success",
 *       duration: 3000,
 *     });
 *   };
 * 
 *   return (
 *     <div>
 *       <button onClick={handleClick}>Show Feedback</button>
 *       <FeedbackContainer />
 *     </div>
 *   );
 * };
 * ```
 * 
 * ### API:
 * #### Methods:
 * - `addFeedback(message: string, options?: FeedbackOptions): void`
 *   - Adds a new feedback to the list.
 *   - `message` (string): The feedback message to display.
 *   - `options` (FeedbackOptions): Optional configurations.
 *     - `type` ("toast" | "alert"): Type of feedback (default: "toast").
 *     - `variant` ("info" | "success" | "error" | "warning"): Visual variant (default: "info").
 *     - `autoDismiss` (boolean): Whether feedback should dismiss automatically (default: true).
 *     - `duration` (number): Auto-dismiss duration in milliseconds (default: 5000ms).
 *     - `onClose` (function): Callback to execute on feedback removal.
 * 
 * - `removeFeedback(id: number): void`
 *   - Removes feedback immediately and triggers its `onClose` callback if provided.
 * 
 * - `subscribe(listener: (feedbacks: Feedback[]) => void): () => void`
 *   - Registers a listener for feedback updates.
 *   - Returns an unsubscribe function to stop listening.
 * 
 * #### Internal Methods:
 * - `startFadeOut(id: number): void`
 *   - Initiates the fade-out animation before removing feedback.
 * 
 * - `notifyListeners(): void`
 *   - Notifies all registered listeners of feedback updates.
 * 
 * ### Types:
 * - `FeedbackVariant`:
 *   - `"info"`, `"success"`, `"error"`, `"warning"`
 * - `Feedback`:
 *   - `id` (number): Unique identifier.
 *   - `message` (string): Feedback content.
 *   - `type` ("toast" | "alert"): Feedback type.
 *   - `variant` (FeedbackVariant): Feedback variant.
 *   - `autoDismiss` (boolean): Whether to auto-dismiss.
 *   - `duration` (number): Auto-dismiss duration in milliseconds.
 *   - `onClose` (function): Callback when feedback is closed.
 *   - `isFadingOut` (boolean): Whether the feedback is fading out.
 * - `FeedbackOptions`:
 *   - Optional properties for `addFeedback` method.
 */
export const feedbackManager = new FeedbackManager();
