import { useCallback } from "react";
import { useFormContext } from "./useFormContext";

export function useField(name: string) {
    const form = useFormContext();
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
                form.setFieldValue(name, e);
            } else if (e instanceof Date) {
                form.setFieldValue(name, e);
            } else if (typeof e === 'string' || typeof e === 'number') {
                form.setFieldValue(name, e);
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
                        form.setFieldValue(name, target.value);
                    }
                } else if (target instanceof HTMLInputElement) {
                    if (target.type === 'checkbox') {
                        // Handle checkbox inputs
                        form.setFieldValue(name, target.checked);
                    } else {
                        form.setFieldValue(name, target.value);
                    }
                } else {
                    form.setFieldValue(name, target.value);
                }
            } else if (e instanceof FileList) {
                form.setFieldValue(name, e ? Array.from(e) : []);
            } else {
                form.setFieldValue(name, e);
            }
        },
        [error]
    );

    return { touched, value, error, onFocus, onBlur, onChange };
}
