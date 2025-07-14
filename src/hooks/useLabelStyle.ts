import { useEffect, useRef, useState } from "react";

/**
 * Custom hook to calculate label width and dynamically set
 * styles for masking the parent's border behind the label,
 * with theme support for light/dark modes.
 *
 * @param label - The label text.
 * @returns [labelRef, dynamicStyles]
 */
export function useLabelStyle(label: string) {
    const labelRef = useRef<HTMLLabelElement>(null);
    const [labelWidth, setLabelWidth] = useState(0);
    const [parentBackground, setParentBackground] = useState("transparent");
    const [labelColor, setLabelColor] = useState("");

    useEffect(() => {
        if (labelRef.current) {
            // Measure label width
            const rect = labelRef.current.getBoundingClientRect();
            setLabelWidth(rect.width);

            // Find nearest ancestor with non-transparent background and text color
            const findParentStyles = (element: HTMLElement | null) => {
                let bgColor = "transparent";
                let textColor = "";

                while (element) {
                    const styles = getComputedStyle(element);
                    
                    // Get background color if not already found
                    if (bgColor === "transparent" && 
                        styles.backgroundColor !== "rgba(0, 0, 0, 0)" &&
                        styles.backgroundColor !== "transparent") {
                        bgColor = styles.backgroundColor;
                    }

                    // Get text color if not already found
                    if (!textColor && styles.color !== "rgba(0, 0, 0, 0)") {
                        textColor = styles.color;
                    }

                    // If we've found both, exit early
                    if (bgColor !== "transparent" && textColor) break;

                    element = element.parentElement;
                }

                // Default fallbacks
                const bodyStyles = getComputedStyle(document.body);
                return {
                    bgColor: bgColor === "transparent" 
                        ? (bodyStyles.backgroundColor === "rgba(0, 0, 0, 0)" 
                            ? "var(--label-default-bg, #fff)" 
                            : bodyStyles.backgroundColor)
                        : bgColor,
                    textColor: textColor || bodyStyles.color || "var(--label-default-text, #808080)"
                };
            };

            const parentElement = labelRef.current.parentElement;
            const { bgColor, textColor } = findParentStyles(parentElement);
            setParentBackground(bgColor);
            setLabelColor(textColor);
        }
    }, [label]);

    const dynamicStyles = {
        "--label-width": `${labelWidth}px`,
        "--label-offset": "10px",
        "--mask-background": parentBackground,
        "--label-color": labelColor,
    } as React.CSSProperties;

    return [labelRef, dynamicStyles] as const;
}
