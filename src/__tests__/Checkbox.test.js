import { fireEvent, render, screen } from '@testing-library/react';
import { Checkbox } from '../components/Checkbox';

describe('Checkbox Component', () => {
    it('renders a single checkbox with the correct label', () => {
        const onChange = jest.fn();
        render(
            <Checkbox
                name="acceptTerms"
                label="Accept Terms"
                value={true}
                onChange={onChange}
            />
        );

        const checkbox = screen.getByLabelText(/accept terms/i);
        expect(checkbox).toBeInTheDocument();
        expect(checkbox).toBeChecked();

        fireEvent.click(checkbox);
        expect(onChange).toHaveBeenCalledWith(false);
    });

    it('renders multiple checkboxes with correct options and handles changes', () => {
        const onChange = jest.fn();
        const options = [
            { label: 'Option 1', value: 'option1' },
            { label: 'Option 2', value: 'option2' },
        ];

        render(
            <Checkbox
                name="preferences"
                label="Select Preferences"
                value={['option1']}
                onChange={onChange}
                options={options}
            />
        );

        const option1 = screen.getByLabelText(/option 1/i);
        const option2 = screen.getByLabelText(/option 2/i);

        // Initial state
        expect(option1).toBeChecked();
        expect(option2).not.toBeChecked();

        // Toggle option2
        fireEvent.click(option2);
        expect(onChange).toHaveBeenCalledWith(['option1', 'option2']);

        // Untoggle option1
        fireEvent.click(option1);
        // This test fails for some reason!!
        expect(onChange).toHaveBeenCalledWith(['option2']);
    });

    it('does not render anything if multiple options are provided but the array is empty', () => {
        render(
            <Checkbox
                name="emptyOptions"
                label="Empty Options"
                value={[]}
                onChange={jest.fn()}
                options={[]}
            />
        );

        const label = screen.queryByText(/empty options/i);
        expect(label).not.toBeInTheDocument();
    });

    it('throws an error if options are provided for a single checkbox', () => {
        const consoleError = jest.spyOn(console, 'error').mockImplementation(() => { });

        expect(() => {
            render(
                <Checkbox
                    name="invalidCase"
                    label="Invalid Case"
                    value={true}
                    onChange={jest.fn()}
                    options={[{ label: 'Option 1', value: 'option1' }]}
                />
            );
        }).toThrow();

        consoleError.mockRestore();
    });

    it('renders the correct structure for multiple checkboxes', () => {
        const options = [
            { label: 'Option 1', value: 'option1' },
            { label: 'Option 2', value: 'option2' },
        ];

        render(
            <Checkbox
                name="preferences"
                label="Select Preferences"
                value={['option1']}
                onChange={jest.fn()}
                options={options}
            />
        );

        const groupLabel = screen.getByText(/select preferences/i);
        expect(groupLabel).toBeInTheDocument();

        const checkboxes = screen.getAllByRole('checkbox');
        expect(checkboxes).toHaveLength(2);
    });

    it('supports empty value for single checkbox', () => {
        const onChange = jest.fn();
        render(
            <Checkbox
                name="acceptTerms"
                label="Accept Terms"
                value={false}
                onChange={onChange}
            />
        );

        const checkbox = screen.getByLabelText(/accept terms/i);
        expect(checkbox).not.toBeChecked();

        fireEvent.click(checkbox);
        expect(onChange).toHaveBeenCalledWith(true);
    });

    it('handles undefined value gracefully for multiple checkboxes', () => {
        const onChange = jest.fn();
        const options = [
            { label: 'Option 1', value: 'option1' },
            { label: 'Option 2', value: 'option2' },
        ];

        render(
            <Checkbox
                name="preferences"
                label="Select Preferences"
                value={undefined}
                onChange={onChange}
                options={options}
            />
        );

        const option1 = screen.getByLabelText(/option 1/i);
        expect(option1).not.toBeChecked();

        fireEvent.click(option1);
        expect(onChange).toHaveBeenCalledWith(['option1']);
    });

    it('handles single checkbox with initial value as false', () => {
        const onChange = jest.fn();

        render(
            <Checkbox name="single-checkbox" label="Accept Terms" value={false} onChange={onChange} />
        );

        const checkbox = screen.getByLabelText(/accept terms/i);
        expect(checkbox).not.toBeChecked();

        fireEvent.click(checkbox);
        expect(onChange).toHaveBeenCalledWith(true);
    });

    it('renders a slider-style single checkbox', () => {
        const onChange = jest.fn();

        render(
            <Checkbox name="slider-checkbox" label="Enable Dark Mode" value={true} onChange={onChange} slider="rounded" />
        );

        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).toBeChecked();
        fireEvent.click(checkbox);
        expect(onChange).toHaveBeenCalledWith(false);
    });

    it('handles multiple checkboxes with initial values', () => {
        const onChange = jest.fn();
        const options = [
            { label: 'Option 1', value: 'option1' },
            { label: 'Option 2', value: 'option2' },
        ];

        render(
            <Checkbox
                name="multi-checkbox"
                label="Choose options"
                value={['option1']}
                onChange={onChange}
                options={options}
            />
        );

        const option1 = screen.getByLabelText(/option 1/i);
        const option2 = screen.getByLabelText(/option 2/i);

        expect(option1).toBeChecked();
        expect(option2).not.toBeChecked();

        fireEvent.click(option2);
        expect(onChange).toHaveBeenCalledWith(['option1', 'option2']);
    });

    it('does nothing when multiple checkbox options are empty', () => {
        const onChange = jest.fn();

        render(<Checkbox name="empty-multi-checkbox" value={[]} onChange={onChange} options={[]} />);

        expect(screen.queryByRole('checkbox')).toBeNull();
    });
});
