export type RadioInputProps = {
    type: string;
    name: string;
    label: string;
    value: string | number;
    onChange: (value: string | number) => void;
    options: {
        label: string;
        value: string | number;
    }[];
}

/**
 * A `Radio` component for rendering a group of radio buttons.
 * 
 * This component supports selecting a single value from a list of options.
 * It gracefully handles edge cases such as empty options, duplicate values, 
 * and ensures predictable behavior by automatically selecting the first 
 * occurrence of a duplicate value.
 * 
 * @component
 * 
 * @param {RadioInputProps} props - The props for the Radio component.
 * @param {string} props.name - The name of the radio input group.
 * @param {string} props.label - The label displayed above the radio group.
 * @param {string | number} props.value - The currently selected value of the radio group.
 * @param {(value: string | number) => void} props.onChange - Callback invoked when a radio button is selected.
 * @param {{ label: string, value: string | number}[]} props.options - Array of options for the radio group. Each option contains:
 * - `label`: The display text for the radio button.
 * - `value`: The value associated with the radio button.
 * 
 * @example
 * const options = [
 *   { label: 'Option 1', value: 'option1' },
 *   { label: 'Option 2', value: 'option2' },
 *   { label: 'Option 3', value: 'option3' },
 * ];
 * 
 * <Radio
 *   name="example"
 *   label="Choose an Option"
 *   value="option1"
 *   onChange={(value) => console.log(value)}
 *   options={options}
 * />
 * 
 * @returns {JSX.Element | null} The rendered radio button group, or null if no options are provided.
 */
export function Radio({ name, label, value, onChange, options, type = "radio" }: RadioInputProps) {
    if (!options || options.length === 0) {
        return null;
    }

    // Here we track encountered values to ensure only the first occurrence of a duplicate value is marked as checked
    const seenValues = new Set<string | number>();

    return (
        <div>
            <label>{label}</label>
            {options.map((option, index) => {
                const isChecked = value === option.value && !seenValues.has(option.value);
                seenValues.add(option.value);

                return (
                    // Here we combine value, label and index to maintain unique keys even for duplicate values.
                    <label key={`${option.value}-${option.label}-${index}`} style={{ display: 'block', margin: '4px 0' }}>
                        <input
                            type={type}
                            name={name}
                            value={option.value}
                            checked={isChecked}
                            onChange={() => onChange(option.value)}
                        />
                        {option.label}
                    </label>
                );
            })}
        </div>
    );
}
