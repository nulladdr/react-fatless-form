import React, { useEffect, useRef, useState } from 'react';
import { useLabelStyle } from '../../hooks/useLabelStyle';
import globalStyles from '../Global.module.css';
import styles from './SelectBox.module.css';

export type SelectInputType = {
    name: string;
    type: "select";
    options: {
        label: string;
        value: string | number;
    }[];
    style?: React.CSSProperties;
    onChange: (value: string | number | (string | number)[]) => void;
    value: string | number | (string | number)[];
    multiple?: boolean;
    placeholder?: string;
    className?: string;
    label?: string;
    disabled?: boolean;
    loading?: boolean;
    error?: string;
};

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
    const [position, setPosition] = useState<'above' | 'below'>('below');
    const [labelRef, dynamicStyles] = useLabelStyle(label);
    const controlRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const optionsRef = useRef<HTMLUListElement>(null);

    const toggleDropdown = () => setIsOpen(prev => !prev);
    const closeDropdown = () => setIsOpen(false);

    // Calculate dropdown position
    useEffect(() => {
        if (!isOpen || !controlRef.current || !dropdownRef.current) return;

        const calculatePosition = () => {
            const controlRect = controlRef.current!.getBoundingClientRect();
            const spaceBelow = window.innerHeight - controlRect.bottom;
            const dropdownHeight = Math.min(
                200, // max-height from CSS
                dropdownRef.current!.scrollHeight
            );
            
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
    }, [isOpen, options, search]);

    const handleOptionClick = (val: string | number) => {
        if (multiple) {
            const updated = Array.isArray(value) ? [...value] : [];
            const newValue = updated.includes(val)
                ? updated.filter(v => v !== val)
                : [...updated, val];
            onChange(newValue);
        } else {
            onChange(val);
        }
        closeDropdown();
    };

    const handleSelectAll = () => {
        if (multiple) {
            onChange(options.map(option => option.value));
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

    const filteredOptions = options?.filter(option =>
        option.label.toLowerCase().includes(search.toLowerCase())
    );

    const displayValue = () => {
        const selected = Array.isArray(value) ? value : [value];
        if (selected.length > 0) {
            if (multiple) {
                const total = options.length;
                const selectedLabels = selected.map(val => 
                    options.find(o => o.value === val)?.label
                );

                if (selected.length > 3) {
                    return `${selected.length} of ${total} selected`;
                }
                return selectedLabels.join(', ');
            } else {
                return options.find(o => o.value === selected[0])?.label;
            }
        }
        return placeholder;
    };

    const getClassNames = () => {
        return [
            globalStyles.inputWrapper,
            styles.control,
            isOpen && globalStyles.selectBoxOpen,
            error && globalStyles.inputWrapperError,
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
        <div className={styles.selectBox} ref={controlRef}>
            <div 
                className={getClassNames()} 
                onClick={toggleDropdown} 
                style={{ ...dynamicStyles, ...style }}
            >
                <label 
                    ref={labelRef} 
                    className={`${globalStyles.label} ${error ? globalStyles.errorLabel : ''}`}
                >
                    {label}
                </label>
                <span 
                    className={styles.value} 
                    style={{ color: !String(value) ? 'rgb(204, 204, 204)' : 'inherit' }}
                >
                    {displayValue()}
                </span>
                <span className={styles.arrow}>
                    {isOpen ? '\u005E' : '\u2304'}
                </span>
            </div>

            {isOpen && (
                <div 
                    ref={dropdownRef}
                    className={getDropdownClasses()}
                >
                    <div className={styles.dropdownHeader}>
                        {multiple && (
                            <div className={styles.actions}>
                                <button 
                                    type="button" 
                                    className={styles.actionButton} 
                                    onClick={handleSelectAll}
                                >
                                    Select All
                                </button>
                                {(Array.isArray(value) && value.length > 0) && (
                                    <button 
                                        type="button" 
                                        className={styles.actionButton} 
                                        onClick={handleClearSelected}
                                    >
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
                                onChange={e => setSearch(e.target.value)}
                                autoFocus
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
                    </div>
                    <ul ref={optionsRef} className={styles.options} role="listbox">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map(option => (
                                <li
                                    key={option.value}
                                    className={`${styles.option} ${
                                        (Array.isArray(value) && value.includes(option.value)) 
                                            ? styles.selected 
                                            : ''
                                    }`}
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
