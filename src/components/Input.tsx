
import React from "react";
import { useField } from "../hooks/useField";
import { Checkbox } from "./Checkbox";
import { DateInput, DateInputType } from './DateInput';
import DefaultInput from "./DefaultInput";
import { FileInput, FileInputType } from "./FileInput";
import { Radio, RadioInputProps } from "./Radio";
import { SelectBox, SelectInputType } from "./SelectBox";

type CommonProps = {
    name: string;
    label: string;
    disabled?: boolean;
    required?: boolean;
    className?: string,
    style?: React.CSSProperties,
};

export type InputProps =
    | ({
        type: "file";
        accept?: string;
        multiple?: boolean;
    } & CommonProps)
    | ({
        type: "date";
        minDate?: string;
        maxDate?: string;
        placeholder?: string;
    } & CommonProps)
    | ({
        type: "select";
        options: {
            label: string;
            value: string | number;
        }[];
        loading?: boolean;
        multiple?: boolean;
        placeholder?: string;
    } & CommonProps)
    | ({
        type: "checkbox";
        checked?: boolean;
        options?: {
            label: string;
            value: string | number;
        }[]
        slider?: "rounded" | "default";
    } & CommonProps)
    | ({
        type: "radio";
        options: {
            label: string;
            value: string | number;
        }[];
    } & CommonProps)
    | ({
        type: "textarea";
        cols?: number;
        rows?: number;
        wrap?: 'hard' | 'soft';
        readonly?: boolean;
        maxlength?: number;
        placeholder?: string;
        autofocus?: boolean;
    } & CommonProps)
    | ({
        type: "text" | "number" | "password";
        placeholder?: string;
        autofocus?: boolean;
    } & CommonProps);

/**
 * A versatile `Input` component that dynamically renders various types of form controls based on the `type` prop.
 *
 * ### Overview
 * The `Input` component automatically integrates with form state management by handling `value` and `onChange` props internally. 
 * This ensures that developers only need to focus on providing the necessary configurations for their inputs, without worrying 
 * about manually managing state.
 * 
 * ### Supported Input Types
 * - **Text-based Inputs**: Includes `text`, `number`, `password`, etc.
 * - **Textarea**: Multi-line text input with options for rows, columns, and wrapping.
 * - **Checkbox**: Supports both standalone checkboxes and grouped checkboxes.
 * - **Radio Buttons**: Renders a group of mutually exclusive options.
 * - **Select Dropdown**: A dropdown menu with options for single or multiple selection.
 * - **Date Picker**: Renders a date input with optional minimum and maximum date constraints.
 * - **File Input**: For uploading files, with support for specifying file types and allowing multiple file uploads.
 *
 * ### Key Features
 * - **Dynamic Rendering**: Automatically renders the correct form control based on the `type` prop.
 * - **Type-Safe Props**: Each input type enforces its own specific props, ensuring you pass only valid props.
 * - **Styling Options**: Supports `className` and `style` props for customization.
 *
 * ### Common Props
 * All input types support these shared props:
 * - `name` (required): Name of the input field, used for form state management.
 * - `label` (optional): A label displayed for the input field.
 * - `disabled` (optional): Disables the input field if `true`.
 * - `required` (optional): Marks the input field as required.
 * - `className` (optional): Adds custom CSS class names to the component.
 * - `style` (optional): Inline styles for the component.
 *
 * ### Type-Specific Props
 * Each input type supports additional props specific to its functionality:
 * - **File Input (`type: "file"`)**
 *   - `accept`: Specifies accepted file types (e.g., `.jpg,.png`).
 *   - `multiple`: Allows multiple file selection if `true`.
 *
 * - **Date Input (`type: "date"`)**
 *   - `minDate`: Minimum selectable date.
 *   - `maxDate`: Maximum selectable date.
 *   - `placeholder`: Placeholder text for the date input.
 *
 * - **Select Dropdown (`type: "select"`)**
 *   - `options`: Array of `{ label: string; value: string | number }` for the dropdown options.
 *   - `loading`: Displays a loading indicator if `true`.
 *   - `multiple`: Enables multi-select if `true`.
 *   - `placeholder`: Placeholder text for the dropdown.
 *
 * - **Checkbox (`type: "checkbox"`)**
 *   - `checked`: Indicates if the checkbox is selected.
 *   - `options`: Array of `{ label: string; value: string | number }` for grouped checkboxes.
 *   - `slider`: Visual style for the checkbox (e.g., `rounded`, `default`).
 * 
 * #### Behavior
 * 
 * - ***Single Checkbox***: 
 *   - If `options` is not provided, it renders a single checkbox.
 *   - If `slider` is provided, the checkbox is styled as a switch.
 * - ***Multiple Checkboxes***: 
 *   - If `options` is provided and has at least one item, it renders a list of checkboxes. 
 *   - If `options` is empty, the component renders nothing.
 *
 * - **Textarea (`type: "textarea"`)**
 *   - `cols`: Number of columns for the textarea.
 *   - `rows`: Number of rows for the textarea.
 *   - `wrap`: Text wrapping behavior (`hard` or `soft`).
 *   - `readonly`: Prevents text modification if `true`.
 *   - `maxlength`: Maximum number of characters allowed.
 *
 * ### Examples
 *
 * **1. Text Input**
 * ```tsx
 * <Input name="username" type="text" label="Username" placeholder="Enter your username" />
 * ```
 *
 * **2. Checkbox Group**
 * ```tsx
 * <Input
 *   name="preferences"
 *   type="checkbox"
 *   label="Preferences"
 *   options={[
 *     { label: "Option 1", value: "option1" },
 *     { label: "Option 2", value: "option2" },
 *   ]}
 * />
 * ```
 *
 * **3. Radio Buttons**
 * ```tsx
 * <Input
 *   name="gender"
 *   type="radio"
 *   label="Gender"
 *   options={[
 *     { label: "Male", value: "male" },
 *     { label: "Female", value: "female" },
 *   ]}
 * />
 * ```
 *
 * **4. Select Dropdown**
 * ```tsx
 * <Input
 *   name="country"
 *   type="select"
 *   label="Country"
 *   options={[
 *     { label: "Kenya", value: "ke" },
 *     { label: "South Africa", value: "sa" },
 *   ]}
 *   placeholder="Choose your country"
 * />
 * ```
 *
 * **5. File Upload**
 * ```tsx
 * <Input name="resume" type="file" label="Upload Resume" accept=".pdf,.docx" multiple />
 * ```
 *
 * **6. Date Picker**
 * ```tsx
 * <Input
 *   name="dob"
 *   type="date"
 *   label="Date of Birth"
 *   minDate={new Date()}
 *   maxDate={new Date(2033, 11, 31)}
 * />
 * ```
 *
 * ### Usage Notes
 * - Ensure the `type` matches the expected props; passing invalid props will result in a TypeScript error.
 * - For `checkbox` and `radio` types, `options` should be provided as an array of `{ label, value }`.
 * - For `select`, `options` must be provided, and `multiple` can enable multi-selection.
 *
 * @param {InputProps} props - Props for configuring the input field.
 */
export function Input({ type, ...rest }: InputProps) {
    // @ts-ignore
    const field = useField(rest.name);

    return (
        <div style={{ margin: "5px" }}>
            {type === "textarea" ? (
                <textarea {...field} {...rest}></textarea>
            ) : type === "checkbox" ? (
                <Checkbox
                    type={type}
                    {...rest}
                    {...field}
                />
            ) : type === "radio" ? (
                <Radio {...(rest) as RadioInputProps} {...field} />
            ) : type === "select" ? (
                <SelectBox
                    {...field}
                    {...(rest as SelectInputType)}
                />
            ) : type === "date" ? (
                <DateInput 
                    {...field} 
                    {...(rest as DateInputType)}
                />
            ) : type === "file" ? (
                <FileInput
                    {...field}
                    {...(rest as FileInputType)}
                />
            ) : (
                <DefaultInput type={type} {...field} {...rest} />
            )}
        </div>
    );
};
