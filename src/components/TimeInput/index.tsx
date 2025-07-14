import React, { useState, useRef, useEffect } from "react";

import globalStyles from '../Global.module.css';
import styles from "./TimeInput.module.css";
import { useLabelStyle } from "hooks/useLabelStyle";

export type TimeInputType = {
    name: string;
    value: string | null;
    onChange: (time: string | null) => void;
    label: string;
    minTime?: string;
    maxTime?: string;
    style?: React.CSSProperties;
    className?: string;
    error?: string;
    placeholder?: string;
    rightIcon?: React.JSX.Element;
    disabled?: boolean;
}

const parseTime = (time: string): number => {
    const [hourMinute, period] = time.split(" ");
    const [hour, minute] = hourMinute.split(":").map(Number);
    let hours = hour % 12;
    if (period === "PM") hours += 12;
    return hours * 60 + minute; // Convert to minutes for comparison
};


const generateTimes = (minTime?: string, maxTime?: string): string[] => {
    const times: string[] = [];
    for (let i = 0; i < 24 * 12; i++) {
        const hours = Math.floor(i / 12) % 12 || 12;
        const minutes = String((i % 12) * 5).padStart(2, "0");
        const period = i < 144 ? "AM" : "PM";
        const time = `${hours}:${minutes} ${period}`;
    
        // Compare in minutes
        if (
            (!minTime || parseTime(time) >= parseTime(minTime)) &&
            (!maxTime || parseTime(time) <= parseTime(maxTime))
        ) {
            times.push(time);
        }
    }
    return times;
};

/**
 * TimeInput component allows users to select a time from a dropdown list.
 * 
 * @component
 * 
 * @example
 * 
 * ```tsx
 * <TimeInput
 *   value="10:00 AM"
 *   onChange={(time) => console.log(time)}
 *   label="Select Time"
 *   minTime="09:00 AM"
 *   maxTime="05:00 PM"
 *   placeholder="Select time"
 *   rightIcon={<SomeIcon />}
 * />
 * ```
 * 
 * @typedef {Object} TimeInputType
 * @property {string | null} value - The selected time value in "hh:mm AM/PM" format.
 * @property {(time: string | null) => void} onChange - Callback function to handle time change.
 * @property {string} label - The label for the time input.
 * @property {string} [minTime] - The minimum selectable time in "hh:mm AM/PM" format.
 * @property {string} [maxTime] - The maximum selectable time in "hh:mm AM/PM" format.
 * @property {React.CSSProperties} [style] - Custom styles for the component.
 * @property {string} [className] - Additional class names for the component.
 * @property {string} [error] - Error message to display.
 * @property {string} [placeholder] - Placeholder text for the input.
 * @property {boolean} [disabled] - Disables the input if `true`.
 * @property {React.JSX.Element} [rightIcon] - Icon to display on the right side of the input.
 * 
 * @param {TimeInputType} props - Props for the TimeInput component.
 * @returns {JSX.Element} The rendered TimeInput component.
 */
export function TimeInput({ 
    value, 
    onChange, 
    error = '', 
    minTime, 
    maxTime, 
    label = '', 
    style, 
    placeholder="hh:mm AM/PM", 
    className,
    rightIcon,
    disabled,
}: TimeInputType): React.JSX.Element {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [position, setPosition] = useState<'above' | 'below'>('below');
    const [labelRef, dynamicStyles] = useLabelStyle(label);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const controlRef = useRef<HTMLDivElement>(null);
    const timeOptionRefs = useRef<HTMLDivElement[]>([]);
    const times = generateTimes(minTime, maxTime);

    // Calculate dropdown position
    useEffect(() => {
        if (!isOpen || !controlRef.current || !dropdownRef.current) return;

        const calculatePosition = () => {
            const controlRect = controlRef.current!.getBoundingClientRect();
            const dropdownHeight = Math.min(250, dropdownRef.current!.scrollHeight);
            const spaceBelow = window.innerHeight - controlRect.bottom;
            const spaceAbove = controlRect.top;
            
            // Choose position with most space
            setPosition(spaceBelow >= dropdownHeight || spaceBelow >= spaceAbove 
                ? 'below' 
                : 'above');
        };

        calculatePosition();
        
        window.addEventListener('scroll', calculatePosition, true);
        window.addEventListener('resize', calculatePosition);
        
        return () => {
            window.removeEventListener('scroll', calculatePosition, true);
            window.removeEventListener('resize', calculatePosition);
        };
    }, [isOpen, times]);

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (controlRef.current && 
                !controlRef.current.contains(event.target as Node) &&
                dropdownRef.current && 
                !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Scroll to selected time
    useEffect(() => {
        if (isOpen && value && dropdownRef.current) {
            const selectedIndex = times.findIndex(time => time === value);
            if (selectedIndex !== -1) {
                setTimeout(() => {
                    timeOptionRefs.current[selectedIndex]?.scrollIntoView({
                        block: 'center',
                        behavior: 'smooth'
                    });
                }, 10);
            }
        }
    }, [isOpen, value, times]);

    const toggleTimePicker = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!disabled) {
            setIsOpen(prev => {
                if (!prev) {
                    // Force reflow when opening to enable transition
                    setTimeout(() => {
                        dropdownRef.current?.getBoundingClientRect();
                    }, 0);
                }
                return !prev;
            });
        }
    };

    const getClassNames = () => {
        return [
            globalStyles.inputWrapper,
            styles.control,
            isOpen && globalStyles.selectBoxOpen,
            error && globalStyles.inputWrapperError,
            disabled && globalStyles.disabled,
            className
        ]
            .filter(Boolean)
            .join(' ');
    };

    const getDropdownClasses = () => {
        return [
            styles.dropdown,
            position === 'above' ? styles.above : styles.below
        ].join(' ');
    };

    return (
        <div className={styles.timeInput} ref={controlRef}>
            <div 
                className={getClassNames()} 
                onClick={toggleTimePicker}
                style={{ ...dynamicStyles, ...style }}
                aria-disabled={disabled}
            >
                <label ref={labelRef} className={`${globalStyles.label} ${error ? globalStyles.errorLabel : ''}`}>
                    {label}
                </label>
                <div 
                    className={styles.input}
                    style={{ 
                        color: value ? 'inherit' : 'var(--placeholder-color, #cccccc)',
                        opacity: disabled ? 0.7 : 1
                    }}
                >
                    {value || placeholder}
                </div>
                
                {isOpen && (
                    <div 
                        ref={dropdownRef}
                        className={getDropdownClasses()}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {times.map((time, index) => (
                            <div
                                key={time}
                                ref={el => { if (el) timeOptionRefs.current[index] = el; }}
                                className={`${styles.option} ${time === value ? styles.selected : ''}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onChange(time);
                                    setIsOpen(false);
                                }}
                            >
                                {time}
                            </div>
                        ))}
                    </div>
                )}
                
                <button
                    type="button"
                    onClick={toggleTimePicker}
                    disabled={disabled}
                    className={globalStyles.rightIcon}
                >
                    <span>{rightIcon || '🕑'}</span>
                </button>
            </div>
            {error && <p className={globalStyles.errorMessage}>{error}</p>}
        </div>
    );
}
