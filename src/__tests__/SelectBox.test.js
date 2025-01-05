import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { SelectBox } from '../components/SelectBox';

describe('SelectBox Component', () => {
    const options = [
        { label: 'Option 1', value: 1 },
        { label: 'Option 2', value: 2 },
        { label: 'Option 3', value: 3 },
        { label: 'Option 4', value: 4 },
    ];

    it('renders with placeholder', () => {
        render(<SelectBox options={options} onChange={jest.fn()} />);
        expect(screen.getByText('Select...')).toBeInTheDocument();
    });

    it('renders with initial value (single select)', () => {
        render(
            <SelectBox
                options={options}
                onChange={jest.fn()}
                value={1}
            />
        );
        expect(screen.getByText('Option 1')).toBeInTheDocument();
    });

    it('renders with initial values (multi-select)', () => {
        render(
            <SelectBox
                options={options}
                multiple
                onChange={jest.fn()}
                value={[1, 3]}
            />
        );
        expect(screen.getByText('Option 1, Option 3')).toBeInTheDocument();
    });

    it('toggles the dropdown on click', () => {
        render(<SelectBox options={options} onChange={jest.fn()} />);
        fireEvent.click(screen.getByText('Select...'));
        expect(screen.getByRole('listbox')).toBeInTheDocument();
        fireEvent.mouseDown(document.body);
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('handles single option selection', () => {
        const onChangeMock = jest.fn();
        render(<SelectBox options={options} onChange={onChangeMock} />);
        fireEvent.click(screen.getByText('Select...'));
        fireEvent.click(screen.getByText('Option 2'));
        expect(onChangeMock).toHaveBeenCalledWith(2);
    });

    it('handles multiple option selection', () => {
        const onChangeMock = jest.fn();
        render(<SelectBox options={options} multiple onChange={onChangeMock} />);
        fireEvent.click(screen.getByText('Select...'));
        fireEvent.click(screen.getByText('Option 1'));
        fireEvent.click(screen.getByText('Option 3'));
        expect(onChangeMock).toHaveBeenCalledWith([1, 3]);
    });

    it('handles "Select All" in multiselect mode', () => {
        const onChangeMock = jest.fn();
        render(<SelectBox options={options} multiple onChange={onChangeMock} />);
        fireEvent.click(screen.getByText('Select...'));
        fireEvent.click(screen.getByText('Select All'));
        expect(onChangeMock).toHaveBeenCalledWith([1, 2, 3, 4]);
    });

    it('handles "Clear All" in multiselect mode', () => {
        const onChangeMock = jest.fn();
        render(
            <SelectBox
                options={options}
                multiple
                onChange={onChangeMock}
                value={[1, 2]}
            />
        );
        fireEvent.click(screen.getByText('Option 1, Option 2'));
        fireEvent.click(screen.getByText('Clear All'));
        expect(onChangeMock).toHaveBeenCalledWith([]);
    });

    it('filters options based on search input', () => {
        render(<SelectBox options={options} onChange={jest.fn()} />);
        fireEvent.click(screen.getByText('Select...'));
        const searchInput = screen.getByPlaceholderText('Search...');
        fireEvent.change(searchInput, { target: { value: 'Option 2' } });
        expect(screen.getByText('Option 2')).toBeInTheDocument();
        expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
        expect(screen.queryByText('Option 3')).not.toBeInTheDocument();
    });

    it('displays "No results" when no options match the search', () => {
        render(<SelectBox options={options} onChange={jest.fn()} />);
        fireEvent.click(screen.getByText('Select...'));
        const searchInput = screen.getByPlaceholderText('Search...');
        fireEvent.change(searchInput, { target: { value: 'Nonexistent' } });
        expect(screen.getByText('No results')).toBeInTheDocument();
    });

    it('displays the placeholder when no options are selected', () => {
        render(
            <SelectBox
                options={options}
                value={[]}
                onChange={jest.fn()}
            />
        );
        expect(screen.getByText('Select...')).toBeInTheDocument();
    });

    it('displays the label of the selected option in single-select mode', () => {
        render(
            <SelectBox
                options={options}
                value={[2]}
                onChange={jest.fn()}
            />
        );
        expect(screen.getByText('Option 2')).toBeInTheDocument();
    });

    it('displays comma-separated labels for selected options (<= 3) in multi-select mode', () => {
        render(
            <SelectBox
                options={options}
                value={[1, 2, 3]}
                onChange={jest.fn()}
                multiple
            />
        );
        expect(screen.getByText('Option 1, Option 2, Option 3')).toBeInTheDocument();
    });

    it('displays a summary when more than 3 options are selected in multi-select mode', () => {
        render(
            <SelectBox
                options={options}
                value={[1, 2, 3, 4]}
                onChange={jest.fn()}
                multiple
            />
        );
        expect(screen.getByText('4 of 4 selected')).toBeInTheDocument();
    });

    it('handles single select with an initial empty value gracefully', () => {
        const onChange = jest.fn();
        const options = [
            { label: 'Option 1', value: 'option1' },
            { label: 'Option 2', value: 'option2' },
        ];

        render(
            <SelectBox
                options={options}
                value=""
                onChange={onChange}
                placeholder="Select an option"
            />
        );

        expect(screen.getByText(/select an option/i)).toBeInTheDocument();

        fireEvent.click(screen.getByText(/select an option/i));
        fireEvent.click(screen.getByText(/option 1/i));
        expect(onChange).toHaveBeenCalledWith('option1');
    });

    it('handles multiple select and toggles options', () => {
        const onChange = jest.fn();
        const options = [
            { label: 'Option 1', value: 'option1' },
            { label: 'Option 2', value: 'option2' },
        ];

        render(
            <SelectBox options={options} value={[]} multiple={true} onChange={onChange} />
        );

        fireEvent.click(screen.getByText(/select.../i));
        fireEvent.click(screen.getByText(/option 1/i));
        expect(onChange).toHaveBeenCalledWith(['option1']);

        fireEvent.click(screen.getByText(/option 2/i));
        expect(onChange).toHaveBeenCalledWith(['option1', 'option2']);

        fireEvent.click(screen.getByText(/option 1/i));
        expect(onChange).toHaveBeenCalledWith(['option2']);
    });

    it('handles selecting all options in multiple select mode', () => {
        const onChange = jest.fn();
        const options = [
            { label: 'Option 1', value: 'option1' },
            { label: 'Option 2', value: 'option2' },
        ];

        render(
            <SelectBox options={options} value={[]} multiple={true} onChange={onChange} />
        );

        fireEvent.click(screen.getByText(/select.../i));
        fireEvent.click(screen.getByText(/select all/i));
        expect(onChange).toHaveBeenCalledWith(['option1', 'option2']);
    });

    it('filters options based on search input', () => {
        const onChange = jest.fn();
        const options = [
            { label: 'Apple', value: 'apple' },
            { label: 'Banana', value: 'banana' },
            { label: 'Cherry', value: 'cherry' },
        ];

        render(
            <SelectBox options={options} value="" onChange={onChange} />
        );

        fireEvent.click(screen.getByText(/select.../i));
        fireEvent.change(screen.getByPlaceholderText(/search.../i), { target: { value: 'ap' } });

        expect(screen.getByText(/apple/i)).toBeInTheDocument();
        expect(screen.queryByText(/banana/i)).toBeNull();
        expect(screen.queryByText(/cherry/i)).toBeNull();
    });
});
