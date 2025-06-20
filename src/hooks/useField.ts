import { useCallback } from "react";
import { useFormContext } from "./useFormContext";

export function useField<T>(name: keyof T) {
    const form = useFormContext<T>()
    const value = form.values[name];
    const error = form.errors[name];
    const touched = form.touched[name];

    const onFocus = () => {
        if (!touched) {
            form.setFieldTouched(name, true);
        }
    };

    const onBlur = () => {
        if (!touched) {
            form.setFieldTouched(name, true);
        }

        if (error) {
            form.setFieldError(name, error);
        }
    };

    const onChange = useCallback(
        (
            e:
                | React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
                | {
                    label: string;
                    value: string | number;
                }[]
                | FileList
                | Date
                | string
                | number
                | (string | number)[]
                | boolean
        ) => {
            if (error) {
                form.setFieldError(name, '');
            }

            if (typeof e === 'boolean') {
                form.setFieldValue(name, e as unknown as T[keyof T]);
            } else if (e instanceof Date) {
                form.setFieldValue(name, e as unknown as T[keyof T]);
            } else if (typeof e === 'string' || typeof e === 'number') {
                form.setFieldValue(name, e as unknown as T[keyof T]);
            } else if (Array.isArray(e)) {
                const selectedValues = e.map((option) => {
                    if (typeof option === 'object' && option !== null && 'value' in option) {
                        return option.value;
                    }
                    return option;
                });
                // @ts-ignore
                form.setFieldArrayValue(name, selectedValues);
            } else if (e && 'target' in e) {
                const target = e.target as HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement;

                if (target instanceof HTMLSelectElement) {
                    if (target.multiple) {
                        const selectedValues = Array.from(target.selectedOptions, (option) => option.value);
                        form.setFieldArrayValue(name, selectedValues);
                    } else {
                        form.setFieldValue(name, target.value as unknown as T[keyof T]);
                    }
                } else if (target instanceof HTMLInputElement) {
                    if (target.type === 'checkbox') {
                        // Handle checkbox inputs
                        form.setFieldValue(name, target.checked as unknown as T[keyof T]);
                    } else {
                        const value = e.target.value;

                        // If it's a valid number string, convert to number
                        const numeric = Number(value);
                        if (value === '') {
                            form.setFieldValue(name, null as unknown as T[keyof T]);
                        } else if (!isNaN(numeric) && value.trim() !== '') {
                            form.setFieldValue(name, numeric as unknown as T[keyof T]);
                        } else {
                            form.setFieldValue(name, value as unknown as T[keyof T]); // it's a string
                        }
                    }
                } else {
                    form.setFieldValue(name, target.value as unknown as T[keyof T]);
                }
            } else if (e instanceof FileList) {
                form.setFieldValue(name, e ? (Array.from(e) as unknown as T[keyof T]) : ([] as unknown as T[keyof T]));
            } else {
                form.setFieldValue(name, e);
            }
        },
        [error]
    );

    return { touched, value, error, onFocus, onBlur, onChange };
}
