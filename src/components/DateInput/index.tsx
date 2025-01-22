import { useLabelStyle } from '../../hooks/useLabelStyle'
import React, { JSX, useEffect, useRef, useState } from 'react';

import globalStyles from '../Global.module.css';
import styles from './DateInput.module.css';

/**
 * A customizable `DateInput` component for selecting or entering dates in a user-friendly manner.
 *
 * This component includes a text input field and an optional dropdown calendar for selecting dates.
 * It supports disabling specific dates through `minDate` and `maxDate` props, which allow developers 
 * to control the range of selectable dates. Users can interact with the component via text input 
 * (formatted as `DD/MM/YYYY`) or by selecting a date directly from the calendar.
 *
 * ## Features:
 * - **Customizable Styling**: Accepts an optional `className` prop for styling the input field.
 * - **Calendar Dropdown**: Provides an intuitive calendar interface for selecting dates.
 * - **Date Validation**: Ensures that only valid dates are accepted, with error messages for invalid inputs.
 * - **Disabled State**: Fully disables interactions when the `disabled` prop is `true`.
 * - **Date Restrictions**: Use `minDate` and `maxDate` to enforce a selectable date range.
 * - **Keyboard and Mouse Support**: Allows users to input dates manually or pick from the calendar dropdown.
 * - **Time Picker (Optional)**: Includes an optional time picker for selecting time along with the date.
 * 
 * ## Example Usage:
 * ```tsx
 * <DateInput
 *   value={new Date()} // Pre-select today's date
 *   onChange={(date) => console.log('Selected Date:', date)} // Handle date selection
 *   minDate={new Date()} // Restrict to no past dates
 *   maxDate={new Date(2080, 11, 31)} // Allow dates only up to Dec 31, 2080
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
 * - `rightIcon?: JSX.Element`
 *   - An optional icon or element to display on the right side of the input field.
 *
 * - `className?: string`
 *   - An optional CSS class to apply custom styles to the input field.
 *   - Example: `className="custom-date-input"`.
 *
 * ## Notes:
 * - Ensure the `minDate` and `maxDate` props are valid `Date` objects. Invalid dates may cause unexpected behavior.
 * - The component handles date parsing and validation for manual input but requires users to input dates in `DD/MM/YYYY` format.
 * - Custom styles applied via the `className` prop will merge with the component's default styles.
 */
export type DateInputType = {
    type: "date";
    name: string;
    value: Date | null;
    onChange: (value: Date | null) => void;
    disabled?: boolean;
    minDate?: Date;
    maxDate?: Date;
    timePicker?: boolean;
    className?: string;
    style?: React.CSSProperties;
    label?: string;
    placeholder?: string;
    rightIcon?: JSX.Element;
    error?: string;
}

export function DateInput({
    value,
    onChange = () => { },
    disabled = false,
    minDate,
    maxDate,
    timePicker = false,
    className,
    style,
    placeholder = 'DD/MM/YYYY',
    rightIcon,
    label = '',
    error = '',
}: DateInputType) {
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const [inputValue, setInputValue] = useState<string>(
        value ? value.toLocaleDateString('en-GB') : ''
    );
    const [currentMonth, setCurrentMonth] = useState(value?.getMonth() ?? new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(value?.getFullYear() ?? new Date().getFullYear());
    const [labelRef, dynamicStyles] = useLabelStyle(label)

    const isDateDisabled = (date: Date): boolean => {
        if (disabled) return true;
        if (minDate && date < new Date(minDate.setHours(0, 0, 0, 0))) return true;
        if (maxDate && date > new Date(maxDate.setHours(23, 59, 59, 999))) return true;
        return false;
    };

    const validateAndPropagateDate = (formattedValue: string): void => {
        const [day, month, year] = formattedValue.split('/').map(Number);

        if (day && month && year && formattedValue.length === 10) {
            const date = new Date(year, month - 1, day);

            if (
                date.getDate() === day &&
                date.getMonth() === month - 1 &&
                date.getFullYear() === year &&
                !isDateDisabled(date)
            ) {
                setErrorMessage('');
                onChange(date);
            } else {
                setErrorMessage(
                    isDateDisabled(date)
                        ? `Date must be ${minDate ? `after ${minDate.toLocaleDateString('en-GB')}` : ''
                        } ${maxDate ? `and before ${maxDate.toLocaleDateString('en-GB')}` : ''}.`
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
        const rawValue = e.target.value.replace(/[^0-9]/g, '');
        let formattedValue = '';
        let cursorPosition = e.target.selectionStart || 0;

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

        setInputValue(formattedValue);
        validateAndPropagateDate(formattedValue);
    };

    useEffect(() => {
        if (value) {
            setInputValue(timePicker ? value.toLocaleString('en-GB', { 
                day: '2-digit', 
                month: '2-digit', 
                year: 'numeric', 
                hour12: true, 
                hour: '2-digit', 
                minute: '2-digit', 
                hourCycle: 'h12', 
            }) : value.toLocaleDateString('en-GB'));
        }else {
            setInputValue('');
        }
    }, [value]);

    const toggleCalendar = () => {
        if (!disabled) {
            setIsCalendarOpen((prev) => !prev);
        }
    };

    const handleDateChange = (date: Date): void => {
        if (!isDateDisabled(date)) {
            onChange(date);
            setErrorMessage('');
            !timePicker && setIsCalendarOpen(false);
        }
    };

    const handleTimeChange = (time: string) => {
        if (value) {
            const [hour, minute, period] = time.split(/[: ]/);
            const hours24 = period === "PM" ? (Number(hour) % 12) + 12 : Number(hour) % 12;
            const updatedDate = new Date(value);
            updatedDate.setHours(hours24, Number(minute), 0, 0);
            onChange(updatedDate);
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

    const dropdownRef = useRef<HTMLDivElement>(null);
    const timeOptionRefs = useRef<HTMLButtonElement[]>([]);

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

    const renderCalendar = () => (
        <div className={`${styles.calendarDropdown} ${isCalendarOpen ? styles.open : ''}`} ref={dropdownRef} role="dialog">
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
            const selectedTimeIndex = value.getHours() * 4 + Math.floor(value.getMinutes() / 15);
            timeOptionRefs.current[selectedTimeIndex]?.scrollIntoView({
                behavior: 'instant',
                block: 'start',
            });
        }
    }, [isCalendarOpen, timePicker, value]);

    const renderTimePicker = () => {
        if (!timePicker) return null;
      
        const times = Array.from({ length: 96 }, (_, i) => {
            const totalMinutes = i * 15;
            const hour24 = Math.floor(totalMinutes / 60);
            const hour = hour24 % 12 || 12;
            const minute = totalMinutes % 60;
            const period = hour24 < 12 ? "AM" : "PM";
            const formattedTime = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")} ${period}`;
            const isSelected = value && value.getHours() === hour24 && value.getMinutes() === minute;
      
            return (
                <button
                    key={i}
                    ref={(el) => { if (el) timeOptionRefs.current[i] = el; }}
                    onClick={() => handleTimeChange(formattedTime)}
                    className={`${styles.timeOption} ${isSelected ? styles.timeOptionSelected : ""}`}
                    type="button"
                >
                    {formattedTime}
                </button>
            );
        });
      
        return <div className={styles.timePicker}>{times}</div>;
    };

    return (
        <>
            <div className={`${globalStyles.inputWrapper} ${(error || errorMessage) ? globalStyles.inputWrapperError : ''}`} style={dynamicStyles}>
                <label ref={labelRef} className={`${globalStyles.label} ${(error || errorMessage) ? globalStyles.errorLabel : ''}`}>{label}</label>
                <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={`${styles.dateInput} ${className || ''}`}
                    style={style}
                    onFocus={() => setIsCalendarOpen(true)}
                />
                <button
                    type="button"
                    onClick={toggleCalendar}
                    disabled={disabled}
                    className={styles.calendarToggleButton}
                >
                    <span>{rightIcon || '🗓️'}</span>
                </button>
                {isCalendarOpen && renderCalendar()}
            </div>
            {(error || errorMessage) && <div className={globalStyles.errorMessage}>{error || errorMessage}</div>}
        </>
    );
}
