import { fireEvent, render, screen } from '@testing-library/react';
import { DateInput } from '../components/DateInput';

describe('DateInput Component', () => {
    it('renders the input field and calendar toggle button', () => {
        render(<DateInput />);
        expect(screen.getByPlaceholderText('DD/MM/YYYY')).toBeInTheDocument();
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('displays the correct initial date when `value` prop is provided', () => {
        const date = new Date(2023, 11, 25);
        render(<DateInput value={date} />);
        expect(screen.getByPlaceholderText('DD/MM/YYYY')).toHaveValue('25/12/2023');
    });

    it('disables the input and button when `disabled` prop is `true`', () => {
        render(<DateInput disabled />);
        const input = screen.getByPlaceholderText('DD/MM/YYYY');
        const button = screen.getByRole('button');
        expect(input).toBeDisabled();
        expect(button).toBeDisabled();
    });

    it('shows an error message for invalid date format', () => {
        render(<DateInput />);
        const input = screen.getByPlaceholderText('DD/MM/YYYY');
        fireEvent.change(input, { target: { value: '32/13/2024' } });
        expect(screen.getByText('Invalid date.')).toBeInTheDocument();
    });

    it('prevents selection of dates earlier than `minDate` when only `minDate` is supplied', () => {
        const minDate = new Date(2023, 0, 1);
        render(<DateInput minDate={minDate} />);
        const input = screen.getByPlaceholderText('DD/MM/YYYY');

        fireEvent.change(input, { target: { value: '31/12/2022' } });
        expect(screen.getByText('Date must be after 01/01/2023.')).toBeInTheDocument();

        fireEvent.change(input, { target: { value: '01/01/2023' } });
        expect(screen.queryByText('Date must be after 01/01/2023.')).not.toBeInTheDocument();
    });

    it('prevents selection of dates later than `maxDate`', () => {
        const maxDate = new Date(2023, 11, 31);
        render(<DateInput maxDate={maxDate} />);
        const input = screen.getByPlaceholderText('DD/MM/YYYY');

        fireEvent.change(input, { target: { value: '01/01/2024' } });
        expect(screen.getByText('Date must be before 31/12/2023.')).toBeInTheDocument();

        fireEvent.change(input, { target: { value: '31/12/2023' } });
        expect(screen.queryByText('Date must be before 31/12/2023.')).not.toBeInTheDocument();
    });

    it('prevents selection of dates outside the range of `minDate` and `maxDate`', () => {
        const minDate = new Date(2023, 0, 1);
        const maxDate = new Date(2023, 11, 31);
        render(<DateInput minDate={minDate} maxDate={maxDate} />);
        const input = screen.getByPlaceholderText('DD/MM/YYYY');

        fireEvent.change(input, { target: { value: '31/12/2022' } });
        expect(screen.getByText('Date must be after 01/01/2023 before 31/12/2023.')).toBeInTheDocument();

        fireEvent.change(input, { target: { value: '01/01/2024' } });
        expect(screen.getByText('Date must be after 01/01/2023 before 31/12/2023.')).toBeInTheDocument();

        fireEvent.change(input, { target: { value: '01/06/2023' } });
        expect(screen.queryByText('Date must be after 01/01/2023 before 31/12/2023.')).not.toBeInTheDocument();
    });

    it('opens and closes the calendar dropdown on button click', () => {
        render(<DateInput />);
        const button = screen.getByRole('button');
        fireEvent.click(button);
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        fireEvent.click(button);
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('allows selection of a date from the calendar', () => {
        render(<DateInput />);
        const button = screen.getByRole('button');
        fireEvent.click(button);
        const day = screen.getByText('15');
        fireEvent.click(day);
        expect(screen.getByPlaceholderText('DD/MM/YYYY')).toHaveValue('15/12/2024');
    });

    it('renders the current month and year options in the calendar dropdown', () => {
        render(<DateInput />);

        const toggleButton = screen.getByRole('button', { name: /🗓/ });
        fireEvent.click(toggleButton);

        const currentDate = new Date();
        const currentMonth = currentDate.toLocaleString('en-GB', { month: 'long' });
        const currentYear = currentDate.getFullYear().toString();

        expect(screen.getByRole('option', { name: currentMonth })).toBeInTheDocument();
        expect(screen.getByRole('option', { name: currentYear })).toBeInTheDocument();
    });

    it('switches months and years in the calendar dropdown', () => {
        render(<DateInput />);

        const toggleButton = screen.getByRole('button', { name: /🗓/ });
        fireEvent.click(toggleButton);

        const monthDropdown = screen.getByRole('combobox', { name: /month/i });
        const yearDropdown = screen.getByRole('combobox', { name: /year/i });

        fireEvent.change(monthDropdown, { target: { value: '6' } });
        expect(screen.getByText('July')).toBeInTheDocument();

        fireEvent.change(yearDropdown, { target: { value: '2033' } });
        expect(screen.getByText('2033')).toBeInTheDocument();
    });

    it('applies custom styles from `className` and `style` props', () => {
        const customStyle = { border: '1px solid red' };
        render(<DateInput className="custom-class" style={customStyle} />);
        const input = screen.getByPlaceholderText('DD/MM/YYYY');
        expect(input).toHaveClass('custom-class');
        expect(input).toHaveStyle('border: 1px solid red');
    });

    it('handles clicking outside to close the calendar', () => {
        render(<DateInput />);
        const button = screen.getByRole('button');
        fireEvent.click(button);
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        fireEvent.mouseDown(document.body);
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
});
