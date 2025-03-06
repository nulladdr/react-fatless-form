import React from "react";
import { useField } from "../hooks/useField";
import { Checkbox } from "./Checkbox";
import { DateInput, DateInputType } from './DateInput';
import DefaultInput from "./DefaultInput";
import { FileInput, FileInputType } from "./FileInput";
import { Radio, RadioInputType } from "./Radio";
import { SelectBox, SelectInputType } from "./SelectBox";
import Textarea from "./Textarea";
import { TimeInput, TimeInputType } from "./TimeInput";
import { PasswordInput, PasswordInputProps } from "./PasswordInput";

type CommonProps = {
    id?: string;
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
        minDate?: Date;
        maxDate?: Date;
        timePicker?: boolean;
        placeholder?: string;
        rightIcon?: React.JSX.Element;
    } & CommonProps)
    | ({
        type: "time";
        minTime?: string;
        maxTime?: string;
        placeholder?: string;
        rightIcon?: React.JSX.Element;
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
        type: "password";
        placeholder?: string;
        showStrengthIndicator?: boolean;
        passwordPolicy?: (password: string) => { strength: number; message: string };
        showIcon?: React.ReactNode;
        hideIcon?: React.ReactNode;
        autofocus?: boolean;
    } & CommonProps) 
    | ({
        type: "text" | "number" | "email" | "tel";
        placeholder?: string;
        autofocus?: boolean;
        autocomplete?: "on" | "off";
        minlength?: number;
        maxlength?: number;
        pattern?: string;
        readOnly?: boolean;
        ref?: React.Ref<HTMLInputElement>;
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
 *   - `timePicker`: Enables time selection if `true`.
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
 * 
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
 * - **Radio Buttons (`type: "radio"`)**:
 *   - `options`: Array of `{ label: string; value: string | number }` for radio button options.
 * 
 * - **Text-based Inputs (`type: "text" | "number" | "password"`)**:
 *   - `placeholder`: Placeholder text for the input field.
 *   - `autofocus`: Automatically focuses on the input field if `true`.
 *   - `autocomplete`: Enables or disables autocomplete (`on` or `off`).
 *   - `maxlength`: Maximum number of characters allowed.
 *   - `pattern`: Regular expression pattern for input validation.
 * 
 * - **Time Input (`type: "time"`)**:
 *   - `minTime`: Minimum selectable time in "hh:mm AM/PM" format.
 *   - `maxTime`: Maximum selectable time in "hh:mm AM/PM" format.
 *   - `placeholder`: Placeholder text for the time input.
 *   - `rightIcon`: Icon to display on the right side of the input.
 * 
 * - **Password Input (`type: "password"`)**:
 *   - `placeholder`: Placeholder text for the password input.
 *   - `showStrengthIndicator`: Displays a password strength indicator if `true`.
 *   - `passwordPolicy`: Function that returns an object with `strength` (0-100) and `message` (e.g., "Weak", "Strong").
 *   - `showIcon`: Custom icon to display when the password is visible.
 *   - `hideIcon`: Custom icon to display when the password is hidden.
 *   - `autofocus`: Automatically focuses on the input field if `true`.
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
 * **7. Time Picker**
 * ```tsx
 * <Input
 *   name="appointmentTime"
 *   type="time"
 *   label="Appointment Time"
 *   minTime="09:00 AM"
 *   maxTime="05:00 PM"
 * />
 * ```
 *
 * **8. Password Input**
 * ```tsx
 * <Input
 *   name="password"
 *   type="password"
 *   label="Password"
 *   placeholder="Enter your password"
 *   showStrengthIndicator
 *   passwordPolicy={(password) => {
 *     const strength = password.length > 8 ? 100 : 50;
 *     const message = strength === 100 ? "Strong" : "Weak";
 *     return { strength, message };
 *   }}
 * />
 * ```
 * 
 * ### Usage Notes
 * - Ensure the `type` matches the expected props; passing invalid props will result in a TypeScript error.
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ type, ...rest }, ref) => {
    const { touched, ...field } = useField(rest.name);

    return (
      <div style={{ margin: "17px 10px" }}>
        {type === "textarea" ? (
          <Textarea {...field} {...rest} />
        ) : type === "checkbox" ? (
          <Checkbox type={type} {...rest} {...field} />
        ) : type === "radio" ? (
          <Radio {...field} {...(rest as RadioInputType)} />
        ) : type === "select" ? (
          <SelectBox {...field} {...(rest as SelectInputType)} />
        ) : type === "password" ? (
          <PasswordInput {...field} {...(rest as PasswordInputProps)} />
        ) : type === "date" ? (
          <DateInput {...field} {...(rest as DateInputType)} />
        ) : type === "time" ? (
          <TimeInput {...field} {...(rest as TimeInputType)} />
        ) : type === "file" ? (
          <FileInput {...field} {...(rest as FileInputType)} />
        ) : (
          <DefaultInput type={type} {...field} {...rest} ref={ref} />
        )}
      </div>
    );
  }
);

export default Input;
