import { useEffect, useRef, useState } from "react";

/**
 * Custom hook to calculate label width and dynamically set
 * styles for masking the parent's border behind the label,
 * with support for theme switching via `data-theme`.
 *
 * @param label - The label text (for triggering recomputation when changed).
 * @returns [labelRef, dynamicStyles] - Ref to attach to <label>, and inline CSS vars for styling.
 */
export function useLabelStyle(label: string) {
  const labelRef = useRef<HTMLLabelElement>(null);

  // State for label width and computed parent styles
  const [labelWidth, setLabelWidth] = useState(0);
  const [parentBackground, setParentBackground] = useState("transparent");
  const [labelColor, setLabelColor] = useState("");

  /**
   * Computes width of the label and finds background/text color
   * from the nearest visible parent (used for masking effect).
   * This is debounced via requestAnimationFrame.
   */
  const computeStyles = () => {
    requestAnimationFrame(() => {
      if (!labelRef.current) return;

      // Measure label width using layout API
      const rect = labelRef.current.getBoundingClientRect();
      setLabelWidth(rect.width);

      // Traverse parent elements to find background and text color
      const findParentStyles = (element: HTMLElement | null) => {
        let bgColor = "transparent";
        let textColor = "";

        while (element) {
          const styles = getComputedStyle(element);

          if (
            bgColor === "transparent" &&
            styles.backgroundColor !== "rgba(0, 0, 0, 0)" &&
            styles.backgroundColor !== "transparent"
          ) {
            bgColor = styles.backgroundColor;
          }

          if (!textColor && styles.color !== "rgba(0, 0, 0, 0)") {
            textColor = styles.color;
          }

          // Break early if both are found
          if (bgColor !== "transparent" && textColor) break;

          element = element.parentElement;
        }

        // Fallback to body styles if nothing usable was found
        const bodyStyles = getComputedStyle(document.body);
        return {
          bgColor:
            bgColor === "transparent"
              ? bodyStyles.backgroundColor || "var(--label-default-bg, #fff)"
              : bgColor,
          textColor: textColor || bodyStyles.color || "var(--label-default-text, #808080)",
        };
      };

      const parentElement = labelRef.current.parentElement;
      const { bgColor, textColor } = findParentStyles(parentElement);
      setParentBackground(bgColor);
      setLabelColor(textColor);
    });
  };

  useEffect(() => {
    computeStyles();

    // Observe nearest ancestor with `data-theme` for changes
    const rootWithTheme = labelRef.current?.closest("[data-theme]");

    if (rootWithTheme) {
      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (mutation.attributeName === "data-theme") {
            computeStyles(); // Recalculate styles on theme change
          }
        }
      });

      observer.observe(rootWithTheme, { attributes: true });

      // Cleanup observer on unmount
      return () => observer.disconnect();
    }

    // Explicitly return undefined if no observer is created
    return undefined;
  }, [label]); // Only recompute when label text or theme changes

  /**
   * Inline CSS variables used by the component to style
   * label masking and dynamic color/background overrides.
   */
  const dynamicStyles = {
    "--label-width": `${labelWidth}px`,
    "--label-offset": "10px",
    "--mask-background": parentBackground,
    "--label-color": labelColor,
  } as React.CSSProperties;

  return [labelRef, dynamicStyles] as const;
}
