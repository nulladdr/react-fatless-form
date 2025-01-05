import { fireEvent, render, screen } from '@testing-library/react';

import { Radio } from '../components/Radio';

describe('Radio Component', () => {
    it('renders nothing if no options are provided', () => {
        const { container } = render(
            <Radio name="test" label="Choose an option" value="" onChange={jest.fn()} options={[]} />
        );

        expect(container).toBeEmptyDOMElement();
    });

    it('renders correctly with options', () => {
        const options = [
            { label: 'Option 1', value: 'option1' },
            { label: 'Option 2', value: 'option2' },
        ];

        render(
            <Radio name="test" label="Choose an option" value="option1" onChange={jest.fn()} options={options} />
        );

        const label = screen.getByText(/choose an option/i);
        expect(label).toBeInTheDocument();

        const option1 = screen.getByLabelText(/option 1/i);
        const option2 = screen.getByLabelText(/option 2/i);

        expect(option1).toBeInTheDocument();
        expect(option2).toBeInTheDocument();
    });

    it('checks the correct option based on the value', () => {
        const options = [
            { label: 'Option 1', value: 'option1' },
            { label: 'Option 2', value: 'option2' },
        ];

        render(
            <Radio name="test" label="Choose an option" value="option1" onChange={jest.fn()} options={options} />
        );

        const option1 = screen.getByLabelText(/option 1/i);
        const option2 = screen.getByLabelText(/option 2/i);

        expect(option1).toBeChecked();
        expect(option2).not.toBeChecked();
    });

    it('calls onChange with the correct value when an option is selected', () => {
        const onChange = jest.fn();
        const options = [
            { label: 'Option 1', value: 'option1' },
            { label: 'Option 2', value: 'option2' },
        ];

        render(
            <Radio name="test" label="Choose an option" value="option1" onChange={onChange} options={options} />
        );

        const option2 = screen.getByLabelText(/option 2/i);
        fireEvent.click(option2);

        expect(onChange).toHaveBeenCalledWith('option2');
    });

    it('does not call onChange if the already checked option is clicked again', () => {
        const onChange = jest.fn();
        const options = [
            { label: 'Option 1', value: 'option1' },
            { label: 'Option 2', value: 'option2' },
        ];

        render(
            <Radio name="test" label="Choose an option" value="option1" onChange={onChange} options={options} />
        );

        const option1 = screen.getByLabelText(/option 1/i);
        fireEvent.click(option1);

        expect(onChange).not.toHaveBeenCalled();
    });

    it('renders correctly with numeric values', () => {
        const onChange = jest.fn();
        const options = [
            { label: 'Option 1', value: 1 },
            { label: 'Option 2', value: 2 },
        ];

        render(
            <Radio name="test" label="Choose a number" value={2} onChange={onChange} options={options} />
        );

        const option1 = screen.getByLabelText(/option 1/i);
        const option2 = screen.getByLabelText(/option 2/i);

        expect(option1).not.toBeChecked();
        expect(option2).toBeChecked();
    });

    it('handles options with the same label but different values', () => {
        const onChange = jest.fn();
        const options = [
            { label: 'Duplicate Label', value: 'value1' },
            { label: 'Duplicate Label', value: 'value2' },
        ];

        render(
            <Radio name="test" label="Choose an option" value="value2" onChange={onChange} options={options} />
        );

        const radios = screen.getAllByLabelText(/duplicate label/i);
        expect(radios[0]).not.toBeChecked();
        expect(radios[1]).toBeChecked();
    });

    it('handles options with identical values and auto-selects the first encountered option', () => {
        const onChange = jest.fn();
        const options = [
            { label: 'Option 1', value: 'duplicate' },
            { label: 'Option 2', value: 'duplicate' },
            { label: 'Option 3', value: 'unique' },
        ];

        render(
            <Radio name="test" label="Choose an option" value="duplicate" onChange={onChange} options={options} />
        );

        const option1 = screen.getByLabelText(/option 1/i);
        const option2 = screen.getByLabelText(/option 2/i);
        const option3 = screen.getByLabelText(/option 3/i);

        // Only the first encountered option with the duplicate value should be selected
        expect(option1).toBeChecked();
        expect(option2).not.toBeChecked();
        expect(option3).not.toBeChecked();

        // Clicking another option with the same value triggers the change handler
        fireEvent.click(option2);
        expect(onChange).toHaveBeenCalledWith('duplicate');

        // Clicking the unique option updates the value
        fireEvent.click(option3);
        expect(onChange).toHaveBeenCalledWith('unique');
    });

    it('handles empty string as initial value gracefully', () => {
        const onChange = jest.fn();
        const options = [
            { label: 'Option 1', value: 'option1' },
            { label: 'Option 2', value: 'option2' },
        ];

        render(
            <Radio name="test" label="Choose an option" value="" onChange={onChange} options={options} />
        );

        const option1 = screen.getByLabelText(/option 1/i);
        const option2 = screen.getByLabelText(/option 2/i);

        expect(option1).not.toBeChecked();
        expect(option2).not.toBeChecked();
    });
});
