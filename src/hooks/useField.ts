// @ts-nocheck
import { useCallback } from "react";
import { useFormContext } from "./useFormContext";
import { FormState } from "./useForm";

export function useField<T extends FormState<T>>(name: keyof T) {
    const form = useFormContext<T>();
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
                | { label: string; value: string | number }[]
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
                form.setFieldValue(name, e as T[keyof T]);
            } else if (e instanceof Date) {
                form.setFieldValue(name, e as T[keyof T]);
            } else if (typeof e === 'string' || typeof e === 'number') {
                form.setFieldValue(name, e as T[keyof T]);
            } else if (Array.isArray(e)) {
                // Handle array of values (string[] or number[])
                if (e.every(option => typeof option === 'string')) {
                    form.setFieldArrayValue(name, e as string[]); // If array of strings
                } else if (e.every(option => typeof option === 'number')) {
                    form.setFieldArrayValue(name, e as number[]); // If array of numbers
                } else {
                    const selectedValues = e.map(option => {
                        if (typeof option === 'object' && option !== null && 'value' in option) {
                            return option.value;
                        }
                        return option;
                    });
                    form.setFieldArrayValue(name, selectedValues as T[keyof T][]);
                }
            } else if (e && 'target' in e) {
                const target = e.target as HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement;

                if (target instanceof HTMLSelectElement) {
                    if (target.multiple) {
                        const selectedValues = Array.from(target.selectedOptions, (option) => option.value);
                        form.setFieldArrayValue(name, selectedValues as string[]); // Handle multiple select
                    } else {
                        form.setFieldValue(name, target.value as T[keyof T]); // Single select value
                    }
                } else if (target instanceof HTMLInputElement) {
                    if (target.type === 'checkbox') {
                        form.setFieldValue(name, target.checked as T[keyof T]); // Checkbox input
                    } else {
                        form.setFieldValue(name, target.value as T[keyof T]); // Text input
                    }
                } else {
                    form.setFieldValue(name, target.value as T[keyof T]); // Textarea and other input types
                }
            } else if (e instanceof FileList) {
                form.setFieldValue(name, e ? Array.from(e) as T[keyof T] : []); // Handle file input
            } else {
                form.setFieldValue(name, e as T[keyof T]); // Catch-all case
            }
        },
        [form]
    );

    return { touched, value, error, onFocus, onBlur, onChange };
}