import { useLabelStyle } from 'hooks/useLabelStyle'
import React, { JSX, useEffect, useRef, useState } from 'react';

import globalStyles from '../Global.module.css';
import styles from './DateInput.module.css';

export type DateInputType = {
    type: "date";
    name: string;
    value: Date | null;
    onChange: (value: Date | null) => void;
    disabled?: boolean;
    minDate?: Date;
    maxDate?: Date;
    timePicker?: boolean;
    minTime?: string; // Format: "HH:MM"
    maxTime?: string; // Format: "HH:MM"
    dateFormat?:
        | 'MM/dd/yyyy'
        | 'dd/MM/yyyy'
        | 'yyyy-MM-dd'
        | 'MMMM dd, yyyy'
        | 'LLL dd, yyyy';
    noWeekends?: boolean;
    className?: string;
    style?: React.CSSProperties;
    label?: string;
    placeholder?: string;
    rightIcon?: JSX.Element;
    error?: string;
}

/**
 * A customizable `DateInput` component for selecting or entering dates in a user-friendly manner.
 *
 * This component includes a text input field and an optional dropdown calendar for selecting dates.
 * It supports disabling specific dates through `minDate` and `maxDate` props, which allow developers 
 * to control the range of selectable dates. Users can interact with the component via text input 
 * (formatted based on dateFormat prop) or by selecting a date directly from the calendar.
 *
 * ## Features:
 * - **Customizable Styling**: Accepts an optional `className` prop for styling the input field.
 * - **Calendar Dropdown**: Provides an intuitive calendar interface for selecting dates.
 * - **Date Validation**: Ensures that only valid dates are accepted, with error messages for invalid inputs.
 * - **Disabled State**: Fully disables interactions when the `disabled` prop is `true`.
 * - **Date Restrictions**: Use `minDate` and `maxDate` to enforce a selectable date range.
 * - **Keyboard and Mouse Support**: Allows users to input dates manually or pick from the calendar dropdown.
 * - **Time Picker (Optional)**: Includes an optional time picker for selecting time along with the date.
 * - **Date Formatting**: Supports multiple date formats via the `dateFormat` prop.
 * - **Minimum Time**: Restricts time selection when `timePicker` is enabled via `minTime` prop.
 * 
 * ## Example Usage:
 * ```tsx
 * <DateInput
 *   value={new Date()} // Pre-select today's date
 *   onChange={(date) => console.log('Selected Date:', date)} // Handle date selection
 *   minDate={new Date()} // Restrict to no past dates
 *   maxDate={new Date(2080, 11, 31)} // Allow dates only up to Dec 31, 2080
 *   dateFormat="MMMM dd, yyyy" // Use long month name format
 *   timePicker={true} // Enable time selection
 *   minTime="09:00" // Restrict times to 9AM or later
 *   maxTime="16:00" // Restrict times to 4PM or earlier
 *   className="custom-date-input" // Add custom styling to the input field
 * />
 * ```
 *
 * ## Props:
 * - `value?: Date`
 *   - The initial selected date for the input field. Defaults to `null`.
 *   - Example: `new Date(2023, 11, 25)` for December 25, 2023.
 *
 * - `onChange?: (value: Date) => void`
 *   - Callback function triggered when the selected date changes.
 *   - Receives the newly selected `Date` object as an argument.
 *   - Example: `(date) => console.log(date.toISOString())`.
 *
 * - `disabled?: boolean`
 *   - Whether the input and calendar dropdown should be disabled.
 *   - Defaults to `false`.
 *   - Example: `disabled={true}` disables all interactions.
 *
 * - `minDate?: Date`
 *   - The earliest date that can be selected.
 *   - Defaults to `undefined` (no restriction).
 *   - Example: `minDate={new Date()}` prevents selecting past dates.
 *
 * - `maxDate?: Date`
 *   - The latest date that can be selected.
 *   - Defaults to `undefined` (no restriction).
 *   - Example: `maxDate={new Date(2033, 11, 31)}` restricts selection to dates on or before December 31, 2033.
 * 
 * - `timePicker?: boolean`
 *   - Whether to include a time picker along with the date input.
 * 
 * - `minTime?: string`
 *   - The earliest time that can be selected (format: "HH:MM").
 *   - Only applicable when `timePicker` is true.
 *   - Example: "09:00" restricts selection to 9AM or later.
 * 
 * - `maxTime?: string`
 *   - The latest time that can be selected (format: "HH:MM").
 *   - Only applicable when `timePicker` is true.
 *   - Example: "16:00" restricts selection to 4PM or earlier.
 * 
 * - `dateFormat?: string`
 *   - The format to display dates in the input field.
 *   - Options: 'MM/dd/yyyy' | 'dd/MM/yyyy' | 'yyyy-MM-dd' | 'MMMM dd, yyyy' | 'LLL dd, yyyy'
 *   - Defaults to 'dd/MM/yyyy'.
 * 
 * - `noWeekends?: boolean`
 *   - When true, disables selection of weekend dates (Saturday and Sunday)
 *   - Defaults to false
 *   - Example: `noWeekends={true}`
 * 
 * - `rightIcon?: JSX.Element`
 *   - An optional icon or element to display on the right side of the input field.
 *
 * - `className?: string`
 *   - An optional CSS class to apply custom styles to the input field.
 *   - Example: `className="custom-date-input"`.
 */
export function DateInput({
    value,
    onChange = () => { },
    disabled = false,
    minDate,
    maxDate,
    timePicker = false,
    minTime,
    maxTime,
    dateFormat = 'dd/MM/yyyy',
    noWeekends = false,
    className,
    style,
    placeholder,
    rightIcon,
    label = '',
    error = '',
}: DateInputType): JSX.Element {
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const [inputValue, setInputValue] = useState<string>('');
    const [currentMonth, setCurrentMonth] = useState(value?.getMonth() ?? new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(value?.getFullYear() ?? new Date().getFullYear());
    const [labelRef, dynamicStyles] = useLabelStyle(label);
    const [position, setPosition] = useState<'above' | 'below'>('below');
    const dropdownRef = useRef<HTMLDivElement>(null);
    const timeOptionRefs = useRef<HTMLButtonElement[]>([]);

    const getPlaceholder = () => {
        if (placeholder) return placeholder;
        
        switch (dateFormat) {
            case 'MM/dd/yyyy':
                return 'MM/DD/YYYY';
            case 'dd/MM/yyyy':
                return 'DD/MM/YYYY';
            case 'yyyy-MM-dd':
                return 'YYYY-MM-DD';
            case 'MMMM dd, yyyy':
                return 'Month DD, YYYY';
            case 'LLL dd, yyyy':
                return 'Mon DD, YYYY';
            default:
                return 'DD/MM/YYYY';
        }
    };

    // Format date based on dateFormat prop
    const formatDate = (date: Date): string => {
        if (!date) return '';
        
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const monthName = date.toLocaleString('default', { month: 'long' });
        const monthShort = date.toLocaleString('default', { month: 'short' });
        
        switch (dateFormat) {
            case 'MM/dd/yyyy':
                return `${month}/${day}/${year}`;
            case 'dd/MM/yyyy':
                return `${day}/${month}/${year}`;
            case 'yyyy-MM-dd':
                return `${year}-${month}-${day}`;
            case 'MMMM dd, yyyy':
                return `${monthName} ${day}, ${year}`;
            case 'LLL dd, yyyy':
                return `${monthShort} ${day}, ${year}`;
            default:
                return `${day}/${month}/${year}`;
        }
    };

    // Calculate dropdown position
    useEffect(() => {
        if (!isCalendarOpen || !inputRef.current || !dropdownRef.current) return;

        const calculatePosition = () => {
            const controlRect = inputRef.current!.getBoundingClientRect();
            const spaceBelow = window.innerHeight - controlRect.bottom;
            const dropdownHeight = dropdownRef.current!.scrollHeight;
            
            // Position above if there's not enough space below but enough above
            if (spaceBelow < dropdownHeight && controlRect.top > dropdownHeight) {
                setPosition('above');
            } else {
                setPosition('below');
            }
        };

        calculatePosition();
        
        // Add listeners for dynamic repositioning
        window.addEventListener('scroll', calculatePosition, true);
        window.addEventListener('resize', calculatePosition);
        
        return () => {
            window.removeEventListener('scroll', calculatePosition, true);
            window.removeEventListener('resize', calculatePosition);
        };
    }, [isCalendarOpen]);

    const isDateDisabled = (date: Date): boolean => {
        if (disabled) return true;
        if (minDate && date < new Date(minDate.setHours(0, 0, 0, 0))) return true;
        if (maxDate && date > new Date(maxDate.setHours(23, 59, 59, 999))) return true;
        if (noWeekends && (date.getDay() === 0 || date.getDay() === 6)) return true;
        return false;
    };

    const validateAndPropagateDate = (formattedValue: string): void => {
        let date: Date | null = null;
        
        // Try parsing based on dateFormat
        if (dateFormat === 'MM/dd/yyyy') {
            const match = formattedValue.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
            if (match) {
                const [_, month, day, year] = match;
                date = new Date(Number(year), Number(month) - 1, Number(day));
            }
        } else if (dateFormat === 'dd/MM/yyyy') {
            const match = formattedValue.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
            if (match) {
                const [_, day, month, year] = match;
                date = new Date(Number(year), Number(month) - 1, Number(day));
            }
        } else if (dateFormat === 'yyyy-MM-dd') {
            const match = formattedValue.match(/^(\d{4})-(\d{2})-(\d{2})$/);
            if (match) {
                const [_, year, month, day] = match;
                date = new Date(Number(year), Number(month) - 1, Number(day));
            }
        } else if (dateFormat === 'MMMM dd, yyyy' || dateFormat === 'LLL dd, yyyy') {
            // Try parsing the formatted date
            date = new Date(formattedValue);
            if (isNaN(date.getTime())) {
                // Fallback to manual parsing for custom formats
                const match = formattedValue.match(/^([a-zA-Z]+) (\d{2}), (\d{4})$/);
                if (match) {
                    const [_, monthName, day, year] = match;
                    const monthIndex = new Date(`${monthName} 1, 2000`).getMonth();
                    if (!isNaN(monthIndex)) {
                        date = new Date(Number(year), monthIndex, Number(day));
                    }
                }
            }
        }

        if (date && !isNaN(date.getTime())) {
            if (
                !isDateDisabled(date)
            ) {
                setErrorMessage('');
                onChange(date);
            } else {
                setErrorMessage(
                    isDateDisabled(date)
                        ? `Date must be ${minDate ? `after ${formatDate(minDate)}` : ''
                        } ${maxDate ? `and before ${formatDate(maxDate)}` : ''}.`
                        : 'Invalid date.'
                );
                onChange(null);
            }
        } else {
            setErrorMessage('');
            onChange(null);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        let rawValue = e.target.value;
        let cursorPosition = e.target.selectionStart || 0;
        let formattedValue = '';

        if (dateFormat === 'MM/dd/yyyy') {
            rawValue = rawValue.replace(/[^0-9]/g, '');
            if (rawValue.length > 0) {
                formattedValue += rawValue.slice(0, 2);
                if (cursorPosition > 2) cursorPosition += 1;
            }
            if (rawValue.length > 2) {
                formattedValue += '/' + rawValue.slice(2, 4);
                if (cursorPosition > 4) cursorPosition += 1;
            }
            if (rawValue.length > 4) {
                formattedValue += '/' + rawValue.slice(4, 8);
            }
        } else if (dateFormat === 'dd/MM/yyyy') {
            rawValue = rawValue.replace(/[^0-9]/g, '');
            if (rawValue.length > 0) {
                formattedValue += rawValue.slice(0, 2);
                if (cursorPosition > 2) cursorPosition += 1;
            }
            if (rawValue.length > 2) {
                formattedValue += '/' + rawValue.slice(2, 4);
                if (cursorPosition > 4) cursorPosition += 1;
            }
            if (rawValue.length > 4) {
                formattedValue += '/' + rawValue.slice(4, 8);
            }
        } else if (dateFormat === 'yyyy-MM-dd') {
            rawValue = rawValue.replace(/[^0-9]/g, '');
            if (rawValue.length > 0) {
                formattedValue += rawValue.slice(0, 4);
                if (cursorPosition > 4) cursorPosition += 1;
            }
            if (rawValue.length > 4) {
                formattedValue += '-' + rawValue.slice(4, 6);
                if (cursorPosition > 6) cursorPosition += 1;
            }
            if (rawValue.length > 6) {
                formattedValue += '-' + rawValue.slice(6, 8);
            }
        } else {
            // For text-based formats, just use the raw value
            formattedValue = rawValue;
        }

        setInputValue(formattedValue);
        validateAndPropagateDate(formattedValue);
    };

    useEffect(() => {
        if (value) {
            setInputValue(timePicker 
                ? value.toLocaleString('en-GB', { 
                    day: '2-digit', 
                    month: '2-digit', 
                    year: 'numeric', 
                    hour12: true, 
                    hour: '2-digit', 
                    minute: '2-digit', 
                    hourCycle: 'h12', 
                }).replace(' am', ' AM').replace(' pm', ' PM') 
                : formatDate(value));
        } else {
            setInputValue('');
        }
    }, [value, dateFormat]);

    const toggleCalendar = () => {
        if (!disabled) {
            // Save scroll position before opening
            const scrollY = window.scrollY;
            
            setIsCalendarOpen(prev => {
                if (!prev) {
                    setTimeout(() => {
                        // Restore scroll position after dropdown opens
                        window.scrollTo(0, scrollY);
                    }, 0);
                }
                return !prev;
            });
        }
    };

    const formatTime = (date: Date): string => {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const period = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        return `${String(displayHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${period}`;
    };

    const handleDateChange = (date: Date): void => {
        if (!isDateDisabled(date)) {
            // Preserve existing time or apply minTime if it's the first selection
            let newDate = new Date(date);
            
            if (timePicker) {
                if (value) {
                    // Keep existing time when editing
                    newDate.setHours(value.getHours(), value.getMinutes());
                } else if (minTime) {
                    // Apply minTime only for initial selection
                    const [hours, minutes] = minTime.split(':').map(Number);
                    newDate.setHours(hours, minutes, 0, 0);
                }
            }

            onChange(newDate);
            updateInputValue(newDate);
            setErrorMessage('');
            !timePicker && setIsCalendarOpen(false);
        }
    };

    const updateInputValue = (date: Date | null) => {
        if (!date) {
            setInputValue('');
            return;
        }

        const formattedDate = formatDate(date);
        if (timePicker) {
            const formattedTime = formatTime(date);
            setInputValue(`${formattedDate} ${formattedTime}`);
        } else {
            setInputValue(formattedDate);
        }
    };

    const handleTimeChange = (time: string) => {
        if (value) {
            const [hour, minute, period] = time.split(/[: ]/);
            const hours24 = period === "PM" ? (Number(hour) % 12) + 12 : Number(hour) % 12;
            const updatedDate = new Date(value);
            updatedDate.setHours(hours24, Number(minute), 0, 0);
            onChange(updatedDate);
            setIsCalendarOpen(false);
        }
    };

    const handleOutsideClick = (event: MouseEvent) => {
        if (
            !inputRef.current?.contains(event.target as Node) &&
            !dropdownRef.current?.contains(event.target as Node)
        ) {
            setIsCalendarOpen(false);
        }
    };

    useEffect(() => {
        if (isCalendarOpen) {
            document.addEventListener('mousedown', handleOutsideClick);
        } else {
            document.removeEventListener('mousedown', handleOutsideClick);
        }

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [isCalendarOpen]);

    // Update input value whenever value prop changes
    useEffect(() => {
        updateInputValue(value);
    }, [value, dateFormat, timePicker]);

    const generateCalendarDays = (): JSX.Element[] => {
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        const days: JSX.Element[] = [];
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<div key={`empty-${i}`} className={styles.empty} />);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentYear, currentMonth, day);
            const isSelected =
                value &&
                value.getDate() === day &&
                value.getMonth() === currentMonth &&
                value.getFullYear() === currentYear;

            const isDisabled = isDateDisabled(date);

            days.push(
                <button
                    key={day}
                    className={`${styles.day} ${isSelected ? styles.daySelected : ''} ${isDisabled ? styles.dayDisabled : ''}`}
                    onClick={() => handleDateChange(date)}
                    disabled={isDisabled}
                    type='button'
                >
                    {day}
                </button>
            );
        }

        return days;
    };

    const isTimeDisabled = (time: string): boolean => {
        const [hour, minute, period] = time.split(/[: ]/);
        const hours24 = period === "PM" ? (Number(hour) % 12) + 12 : Number(hour) % 12;
        const minutes = Number(minute);

        // Check minTime
        if (minTime) {
            const [minHour, minMinute] = minTime.split(':').map(Number);
            if (hours24 < minHour || (hours24 === minHour && minutes < minMinute)) {
                return true;
            }
        }

        // Check maxTime
        if (maxTime) {
            const [maxHour, maxMinute] = maxTime.split(':').map(Number);
            if (hours24 > maxHour || (hours24 === maxHour && minutes > maxMinute)) {
                return true;
            }
        }

        return false;
    };


    const renderTimePicker = () => {
        if (!timePicker) return null;
      
        const times = Array.from({ length: 288 }, (_, i) => {
            const totalMinutes = i * 5;
            const hour24 = Math.floor(totalMinutes / 60);
            const hour = hour24 % 12 || 12;
            const minute = totalMinutes % 60;
            const period = hour24 < 12 ? "AM" : "PM";
            const formattedTime = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")} ${period}`;
            const isSelected = value && value.getHours() === hour24 && value.getMinutes() === minute;
            const isDisabled = isTimeDisabled(formattedTime);
      
            return (
                <button
                    key={i}
                    ref={(el) => { if (el) timeOptionRefs.current[i] = el; }}
                    onClick={() => !isDisabled && handleTimeChange(formattedTime)}
                    className={`${styles.timeOption} ${isSelected ? styles.timeOptionSelected : ""} ${isDisabled ? styles.timeOptionDisabled : ""}`}
                    type="button"
                    disabled={isDisabled}
                >
                    {formattedTime}
                </button>
            );
        });
      
        return (
            <div 
                className={styles.timePicker}
                style={{
                    backgroundColor: 'var(--timepicker-bg)',
                    color: 'var(--timepicker-text)',
                    borderTopColor: 'var(--timepicker-border)'
                }}
            >
                <div className={styles.timeHeader}>Select Time</div>
                {minTime && maxTime && (
                    <div className={styles.timeRange}>
                        Available: {minTime} - {maxTime}
                    </div>
                )}
                <div style={{ borderRadius: "4px" }}>
                    {times}
                </div>
            </div>
        );
    };

    const renderCalendar = () => (
        <div 
            className={`${styles.calendarDropdown} ${isCalendarOpen ? styles.open : ''} ${position === 'above' ? styles.above : styles.below}`} 
            ref={dropdownRef} 
            role="dialog"
            style={{
                backgroundColor: 'var(--calendar-bg)',
                color: 'var(--calendar-text)',
                borderColor: 'var(--calendar-border)'
            }}
        >
            <div className={styles.calendarHeader}>
                <select
                    value={currentMonth}
                    onChange={(e) => setCurrentMonth(Number(e.target.value))}
                    disabled={disabled}
                    role="combobox"
                    aria-label="month"
                >
                    {Array.from({ length: 12 }, (_, index) =>
                        <option key={index} value={index}>{new Date(0, index).toLocaleString('default', { month: 'long' })}</option>
                    )}
                </select>
                <select
                    value={currentYear}
                    onChange={(e) => setCurrentYear(Number(e.target.value))}
                    disabled={disabled}
                    role="combobox"
                    aria-label="year"
                >
                    {Array.from(
                        { length: 20 },
                        (_, index) => new Date().getFullYear() - 10 + index
                    ).map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>
            </div>
            <div className={styles.daysOfWeek}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className={styles.dayLabel}>
                        {day}
                    </div>
                ))}
            </div>
            <div className={styles.days}>{generateCalendarDays()}</div>
            {timePicker && renderTimePicker()}
        </div>
    );

    useEffect(() => {
        if (isCalendarOpen && timePicker && value) {
            const selectedTimeIndex = value.getHours() * 12 + Math.floor(value.getMinutes() / 5);
            timeOptionRefs.current[selectedTimeIndex]?.scrollIntoView({
                behavior: 'instant',
                block: 'center',
            });
        }
    }, [isCalendarOpen, timePicker, value]);

    return (
        <>
            <div className={`${globalStyles.inputWrapper} ${(error || errorMessage) ? globalStyles.inputWrapperError : ''}`} style={{ ...dynamicStyles, ...style }}>
                <label ref={labelRef} className={`${globalStyles.label} ${(error || errorMessage) ? globalStyles.errorLabel : ''}`}>{label}</label>
                <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder={getPlaceholder()}
                    disabled={disabled}
                    className={`${styles.dateInput} ${className || ''}`}
                    onFocus={() => !disabled && setIsCalendarOpen(true)}
                    style={{
                        color: inputValue ? 'var(--dateinput-value)' : 'var(--dateinput-placeholder)',
                        backgroundColor: 'var(--dateinput-bg)',
                        cursor: disabled ? 'not-allowed' : 'pointer',
                        ...style
                    }}
                />
                <button
                    type="button"
                    onClick={toggleCalendar}
                    disabled={disabled}
                    className={globalStyles.rightIcon}
                    style={{
                        color: disabled ? 'var(--dateinput-disabled)' : 'var(--dateinput-value)'
                    }}
                >
                    <span>{rightIcon || '🗓️'}</span>
                </button>
                {isCalendarOpen && renderCalendar()}
            </div>
            {(error || errorMessage) && <div className={globalStyles.errorMessage}>{error || errorMessage}</div>}
        </>
    );
}
