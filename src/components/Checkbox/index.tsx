import styles from './Switch.module.css';
export interface BaseCheckboxProps {
    type: "checkbox";
    name: string;
    label?: string;
    slider?: "rounded" | "default";
}

interface SingleCheckboxProps extends BaseCheckboxProps {
    value: boolean;
    onChange: (checked: boolean) => void;
}

interface MultiCheckboxProps extends BaseCheckboxProps {
    options: {
        value: string;
        label: string;
    }[];
    value: string[];
    onChange: (selectedValues: string[]) => void;
}

export type CheckboxInputType = SingleCheckboxProps | MultiCheckboxProps;

/**
 * A reusable Checkbox component for handling single and multiple checkbox inputs.
 *
 * This component supports two modes:
 * 1. **Single Checkbox**: For a single boolean value, with optional slider styles.
 * 2. **Multiple Checkboxes**: For selecting multiple values from a list of options.
 *
 * ## Props
 *
 * - **SingleCheckboxProps**:
 *   - `name` (string): The name attribute for the checkbox input.
 *   - `label` (string, optional): The label displayed next to the checkbox.
 *   - `value` (boolean): The current checked state of the checkbox.
 *   - `onChange` (function): A callback triggered when the checkbox state changes.
 *   - `slider` ('rectangular' | 'rounded', optional): If provided, renders the checkbox as a switch. 
 *     - `rectangular`: Renders a rectangular switch.
 *     - `rounded`: Renders a rounded switch.
 *
 * - **MultipleCheckboxProps**:
 *   - `name` (string): The name attribute for the group of checkboxes.
 *   - `label` (string, optional): A label displayed above the group of checkboxes.
 *   - `value` (array of strings or numbers): The current selected values.
 *   - `onChange` (function): A callback triggered with the updated array of selected values.
 *   - `options` (array of SelectOption): The options to display as checkboxes, where each option has:
 *     - `label` (string): The display label for the checkbox.
 *     - `value` (string or number): The value associated with the checkbox.
 *
 * ## Behavior
 *
 * - **Single Checkbox**: 
 *   - If `options` is not provided, it renders a single checkbox.
 *   - If `slider` is provided, the checkbox is styled as a switch.
 * - **Multiple Checkboxes**: 
 *   - If `options` is provided and has at least one item, it renders a list of checkboxes. 
 *   - If `options` is empty, the component renders nothing.
 *
 * ## Examples
 *
 * ### Single Checkbox (Default)
 *
 * ```tsx
 * <Checkbox
 *     name="acceptTerms"
 *     label="Accept Terms and Conditions"
 *     value={true}
 *     onChange={(checked) => console.log(checked)}
 * />
 * ```
 *
 * ### Single Checkbox (Slider)
 *
 * ```tsx
 * <Checkbox
 *     name="darkMode"
 *     label="Enable Dark Mode"
 *     value={false}
 *     onChange={(checked) => console.log(checked)}
 *     slider="rounded"
 * />
 * ```
 *
 * ### Multiple Checkboxes
 *
 * ```tsx
 * <Checkbox
 *     name="preferences"
 *     label="Choose Preferences"
 *     value={['option1']}
 *     onChange={(selected) => console.log(selected)}
 *     options={[
 *         { label: 'Option 1', value: 'option1' },
 *         { label: 'Option 2', value: 'option2' },
 *     ]}
 * />
 * ```
 *
 * @param {CheckboxInputType} props - The props to configure the checkbox component.
 *
 * @returns {JSX.Element | null} The rendered checkbox component.
 */
export function Checkbox(props: CheckboxInputType) {
    const { name, label } = props;

    // Single checkbox case
    if (!('options' in props)) {
        const { value, onChange, slider } = props;

        const inputElement = (
            <input
                id={name}
                name={name}
                type="checkbox"
                checked={value}
                onChange={(e) => onChange(e.target.checked)}
            />
        );

        const labelElement = label && <span style={{ marginLeft: '8px' }}>{label}</span>;

        if (!slider) {
            return (
                <label htmlFor={name}>
                    {inputElement}
                    {labelElement}
                </label>
            );
        }

        const sliderClass = `${styles.slider} ${slider === 'rounded' ? styles.round : ''}`;

        return (
            <div>
                <label className={styles.switch} htmlFor={name}>
                    {inputElement}
                    <span className={sliderClass}></span>
                </label>
                {labelElement}
            </div>
        );
    }

    // Multiple checkboxes case
    const { options, value = [], onChange } = props;

    if (!options || options.length === 0) {
        return null;
    }

    return (
        <div>
            {label && <label>{label}</label>}
            <div>
                {options.map((option, index) => (
                    <label
                        key={`${option.value}-${index}`}
                        style={{ display: "block", margin: "4px 0" }}
                    >
                        <input
                            id={`${name}-${option.value}`}
                            type="checkbox"
                            name={name}
                            checked={value.includes(option.value)}
                            onChange={(e) =>
                                onChange(
                                    e.target.checked
                                        ? [...value, option.value]
                                        : value.filter((v) => v !== option.value)
                                )
                            }
                        />
                        {option.label}
                    </label>
                ))}
            </div>
        </div>
    );
}