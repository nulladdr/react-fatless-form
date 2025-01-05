import { useEffect, useState } from "react";
import { Feedback, feedbackManager } from "../utils/FeedbackManager";

export function useFeedback() {
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

    useEffect(() => {
        const listener = (newFeedbacks: Feedback[]) => setFeedbacks(newFeedbacks);
        const unsubscribe = feedbackManager.subscribe(listener);

        return () => {
            unsubscribe()
        };
    }, []);

    return feedbacks;
}
