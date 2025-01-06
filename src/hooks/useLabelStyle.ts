import { useEffect, useRef, useState } from "react";

/**
 * Custom hook to calculate label width and dynamically set
 * styles for masking the parent's border behind the label.
 *
 * @param label - The label text.
 * @returns [labelRef, dynamicStyles]
 */
export function useLabelStyle(label: string) {
    const labelRef = useRef<HTMLLabelElement>(null);
    const [labelWidth, setLabelWidth] = useState(0);
    const [parentBackground, setParentBackground] = useState("transparent");

    useEffect(() => {
        if (labelRef.current) {
            // Measure label width
            const rect = labelRef.current.getBoundingClientRect();
            setLabelWidth(rect.width);

            // Find nearest ancestor with non-transparent background
            const findNonTransparentBackground = (element: HTMLElement | null): string => {
                while (element) {
                    const backgroundColor = getComputedStyle(element).backgroundColor;

                    // Check for non-transparent background
                    if (
                        backgroundColor !== "rgba(0, 0, 0, 0)" &&
                        backgroundColor !== "transparent"
                    ) {
                        return backgroundColor;
                    }

                    element = element.parentElement;
                }

                // Default to body background or white if none found
                const bodyBackground = getComputedStyle(document.body).backgroundColor;
                return bodyBackground === "rgba(0, 0, 0, 0)" ? "#fff" : bodyBackground;
            };

            const parentElement = labelRef.current.parentElement;
            const backgroundColor = findNonTransparentBackground(parentElement);
            setParentBackground(backgroundColor);
        }
    }, [label]);

    const dynamicStyles = {
        "--label-width": `${labelWidth}px`,
        "--label-offset": "10px",
        "--mask-background": parentBackground,
    } as React.CSSProperties;

    return [labelRef, dynamicStyles] as const;
}
