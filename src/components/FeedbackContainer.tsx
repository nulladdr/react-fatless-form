import React from "react";
import ReactDOM from "react-dom";
import { useFeedback } from "../hooks/useFeedback";
import { feedbackManager, FeedbackVariant } from "../utils/FeedbackManager";
import styles from './Feedback.module.css';

const getIcon = (variant: FeedbackVariant) => {
    switch (variant) {
        case "success":
            return <span className={styles.icon}>&#x2713;</span>;
        case "error":
            return <span className={styles.icon}>&#x2717;</span>;
        case "warning":
            return <span className={styles.icon}>&#x26A0;</span>;
        default:
            return <span className={styles.icon}>&#9432;</span>;
    }
};

export function FeedbackContainer() {
    const feedbacks = useFeedback();

    return ReactDOM.createPortal(
        <div className={styles["toast-container"]}>
            {feedbacks.map((feedback) => (
                <div
                    key={feedback.id}
                    className={`${styles.feedback} ${styles[feedback.type]} ${styles[feedback.variant]
                        } ${feedback.isFadingOut ? styles.fadeOut : ""}`}
                >
                    <div className={styles.messageContainer}>
                        {getIcon(feedback.variant)}
                        {feedback.message}
                    </div>
                    {!feedback.autoDismiss && (
                        <button
                            type="button"
                            className={styles.btnClose}
                            aria-label="Close"
                            onClick={() => feedbackManager.startFadeOut(feedback.id)}
                        >
                            &#x2715;
                        </button>
                    )}
                </div>
            ))}
        </div>,
        document.body
    );
}
