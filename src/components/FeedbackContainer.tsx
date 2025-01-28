import React from "react";
import ReactDOM from "react-dom";
import { useFeedback } from "../hooks/useFeedback";
import { feedbackManager, FeedbackVariant } from "../utils/FeedbackManager";
import styles from './Feedback.module.css';

const getIcon = (variant: FeedbackVariant) => {
    const icons = {
        success: <span className={styles.icon}>&#x2713;</span>,
        error: <span className={styles.icon}>&#x2715;</span>,
        warning: <span className={styles.icon}>&#x21;</span>,
        info: <span className={styles.icon}>&#8505;</span>,
    };
    return icons[variant] || icons.info;
};

export function FeedbackContainer() {
    const feedbacks = useFeedback();
    const alerts = feedbacks.filter(({ type }) => type === "alert");
    const toasts = feedbacks.filter(({ type }) => type === "toast");

    return ReactDOM.createPortal(
        <>
            {/* Alert Container */}
            <div className={styles["alert-container"]}>
                {alerts.map(({ id, variant, message, isFadingOut }) => (
                    <div
                        key={id}
                        className={`${styles.alert} ${styles[variant]} ${isFadingOut ? styles["fade-out"] : ""}`}
                    >
                        <div className={styles["icon-container"]}>
                            <div className={styles[`icon-${variant}`]}>{getIcon(variant)}</div>
                        </div>
                        <div className={styles["message-container"]}>
                            <p className={styles["message-heading"]}>
                                {variant.replace(/^\w/, c => c.toUpperCase())}
                            </p>
                            <p className={styles["message-body"]}>{message}</p>
                        </div>
                        <button
                            type="button"
                            className={styles["btn-close"]}
                            aria-label="Close"
                            onClick={() => feedbackManager.startFadeOut(id)}
                        >
                            &#x2715;
                        </button>
                    </div>
                ))}
            </div>

            {/* Toast Container */}
            <div className={styles["toast-container"]}>
                {toasts.map(({ id, variant, message, isFadingOut }) => (
                    <div
                        key={id}
                        className={`${styles.toast} ${styles[variant]} ${isFadingOut ? styles["fade-out"] : ""}`}
                    >
                        <div className={styles["icon-container"]}>
                            <div className={styles[`icon-${variant}`]}>{getIcon(variant)}</div>
                        </div>
                        <div className={styles["message-container"]}>
                            <p className={`${styles["message-heading"]} ${styles[`heading-${variant}`]}`}>
                                {variant.replace(/^\w/, c => c.toUpperCase())}
                            </p>
                            <p className={styles["message-body"]}>{message}</p>
                        </div>
                        <button
                            type="button"
                            className={styles["btn-close"]}
                            aria-label="Close"
                            onClick={() => feedbackManager.startFadeOut(id)}
                        >
                            &#x2715;
                        </button>
                    </div>
                ))}
            </div>
        </>,
        document.body
    );
}
