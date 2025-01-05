import { useEffect, useRef, useState } from "react";

/**
 * Custom hook to calculate label width and dynamically set
 * styles for masking the parent's border behind the label.
 *
 * @param label - The label text.
 * @returns [labelRef, dynamicStyles]
 */
export function useLabelStyle(
    label: string
) {
    const labelRef = useRef<HTMLLabelElement>(null);
    const [labelWidth, setLabelWidth] = useState(0);
    const [parentBackground, setParentBackground] = useState("transparent");

    useEffect(() => {
        if (labelRef.current) {
            const rect = labelRef.current.getBoundingClientRect();
            setLabelWidth(rect.width);

            const parentElement = labelRef.current?.parentElement?.offsetParent;

            if (parentElement) {
                const getBackgroundColor = (element: Element) => {
                    const computedStyle = getComputedStyle(element);
                    return computedStyle.backgroundColor || "rgba(0, 0, 0, 0)";
                };

                let backgroundColor = getBackgroundColor(parentElement);

                if (backgroundColor === "rgba(0, 0, 0, 0)") {
                    const bodyBackground = getBackgroundColor(document.body);
                    backgroundColor = bodyBackground === "rgba(0, 0, 0, 0)" ? "#fff" : bodyBackground;
                }

                setParentBackground(backgroundColor);
            }
        }
    }, [label]);

    const dynamicStyles = {
        "--label-width": `${labelWidth}px`,
        "--label-offset": "10px",
        "--mask-background": parentBackground,
    } as React.CSSProperties;

    return [labelRef, dynamicStyles] as const;
}
