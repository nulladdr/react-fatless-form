import React, { useEffect, useRef, useState } from 'react';

import { useLabelStyle } from '../../hooks/useLabelStyle'
import globalStyles from '../Global.module.css';
import styles from './SelectBox.module.css';

export type SelectInputType = {
    name: string;
    type: "select";
    options: {
        label: string;
        value: string | number;
    }[],
    style?: React.CSSProperties,
    onChange: (value: string | number | (string | number)[]) => void;
    value: string | number | (string | number)[];
    multiple?: boolean,
    placeholder?: string,
    className?: string,
    label?: string;
    disabled?: boolean;
    loading?: boolean;
    error?: string;
}

/**
 * A customizable dropdown select component with support for single and multiple selection.
 *
 * This component provides features such as:
 * - Single or multiple selection
 * - Searchable options
 * - "Select All" and "Clear All" actions for multiple selection mode
 * - Initial value handling
 * - Responsive dropdown behavior
 *
 * @param {SelectInputProps & {
*     onChange: (value: string | number | (string | number)[]) => void;
*     value?: string | number | (string | number)[];
* }} props - The properties for the SelectBox component.
*
* @property {Array<{label: string; value: string | number}>} options - The list of options for the dropdown. Each option should have a `label` for display and a `value` for identification.
* @property {boolean} [multiple=false] - Determines whether multiple selections are allowed.
* @property {(value: string | number | (string | number)[]) => void} onChange - Callback invoked when the selected value(s) change.
* @property {string} [placeholder="Select..."] - Placeholder text displayed when no options are selected.
* @property {string} [className] - Custom class names for styling the control.
* @property {React.CSSProperties} [style] - Inline styles for the control.
* @property {string | number | (string | number)[]} [value=[]] - Initial selected value(s). Can be a single value or an array of values.
*
* @returns {JSX.Element} The SelectBox component.
*
* @example
* // Single select usage
* <SelectBox
*   options={[
*     { label: "Option 1", value: 1 },
*     { label: "Option 2", value: 2 }
*   ]}
*   onChange={(value) => console.log(value)}
* />
*
* @example
* // Multiple select usage with initial values
* <SelectBox
*   options={[
*     { label: "Option 1", value: 1 },
*     { label: "Option 2", value: 2 },
*     { label: "Option 3", value: 3 }
*   ]}
*   multiple
*   value={[1, 3]}
*   onChange={(values) => console.log(values)}
* />
*
* @example
* // Styling the component
* <SelectBox
*   options={[{ label: "Styled Option", value: 1 }]}
*   className="custom-select"
*   style={{ border: "1px solid red" }}
*   onChange={(value) => console.log(value)}
* />
*/
export function SelectBox({
    options,
    multiple = false,
    onChange,
    placeholder = 'Select...',
    className,
    style,
    value = [],
    label = '',
    error = '',
}: SelectInputType) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [labelRef, dynamicStyles] = useLabelStyle(label)
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleDropdown = (event: React.MouseEvent<HTMLDivElement>) => {
        setIsOpen((prev) => !prev);

        const wrapper = event.currentTarget as HTMLElement;
    if (wrapper.classList.contains("open")) {
        wrapper.classList.remove("open");
    } else {
        wrapper.classList.add("open");
    }
    }
    const closeDropdown = () => setIsOpen(false);

    const handleOptionClick = (val: string | number) => {
        if (multiple) {
            const updated = Array.isArray(value) ? [...value] : [];
            const newValue = updated.includes(val)
                ? updated.filter((v) => v !== val)
                : [...updated, val];
            onChange(newValue);
        } else {
            onChange(val);
            closeDropdown();
        }
    };

    const handleSelectAll = () => {
        if (multiple) {
            onChange(options.map((option) => option.value));
            closeDropdown();
        }
    };

    const handleClearSelected = () => {
        onChange([]);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                closeDropdown();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredOptions = options?.filter((option) =>
        option.label.toLowerCase().includes(search.toLowerCase())
    );

    const displayValue = () => {
        const selected = Array.isArray(value) ? value : [value];
        if (selected.length > 0) {
            if (multiple) {
                const total = options.length;
                const selectedLabels = selected.map((val) => options.find((o) => o.value === val)?.label);

                if (selected.length > 3) {
                    return `${selected.length} of ${total} selected`;
                }

                return selectedLabels.join(', ');
            } else {
                return options.find((o) => o.value === selected[0])?.label;
            }
        }

        return placeholder;
    };

    return (
        <div className={styles.selectBox} ref={dropdownRef}>
            <div className={`${globalStyles.inputWrapper} ${styles.control} ${className || ''} ${error ? globalStyles.inputWrapperError : ''}`} onClick={toggleDropdown} style={{ ...dynamicStyles, ...style }}>
                <label ref={labelRef} className={`${globalStyles.label} ${error ? globalStyles.errorLabel : ''}`}>{label}</label>
                <span className={styles.value} style={{ color: !String(value) ? '#ccc' : 'inherit' }}>{displayValue()}</span>
                <span className={styles.arrow}>{isOpen ? '\u005E' : '\u2304'}</span>
            </div>

            {isOpen && (
                <div className={styles.dropdown}>
                    {multiple && (
                        <div className={styles.actions}>
                            <button type="button" className={styles.actionButton} onClick={handleSelectAll}>
                                Select All
                            </button>
                            {(Array.isArray(value) && value.length > 0) && (
                                <button type="button" className={styles.actionButton} onClick={handleClearSelected}>
                                    Clear All
                                </button>
                            )}
                        </div>
                    )}
                    <div className={styles.searchContainer}>
                        <input
                            type="text"
                            className={styles.search}
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        {search && (
                            <button
                                type="button"
                                className={styles.clearButton}
                                onClick={() => setSearch('')}
                                aria-label="Clear search"
                            >
                                &#x2715;
                            </button>
                        )}
                        <span className={styles.searchIcon}>&#128269;</span>
                    </div>
                    <ul className={styles.options} role="listbox">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <li
                                    key={option.value}
                                    className={`${styles.option} ${(Array.isArray(value) && value.includes(option.value)) ? styles.selected : ''}`}
                                    onClick={() => handleOptionClick(option.value)}
                                    role="option"
                                >
                                    {option.label}
                                </li>
                            ))
                        ) : (
                            <li className={styles.noResults}>No results</li>
                        )}
                    </ul>
                </div>
            )}
            {error && <p className={globalStyles.errorMessage}>{error}</p>}
        </div>
    );
}
