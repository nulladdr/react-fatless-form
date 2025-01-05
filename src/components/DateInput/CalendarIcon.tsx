import React from 'react';

interface CalendarIconProps {
    className?: string;
}

const CalendarIcon: React.FC<CalendarIconProps> = ({ className }) => {
    const today = new Date();

    const dayOfWeek = today.toLocaleString('en-US', { weekday: 'short' });
    const month = today.toLocaleString('en-US', { month: 'short' });
    const dayOfMonth = today.getDate();
    const isoDate = today.toISOString().split('T')[0];

    return (
        <time dateTime={isoDate} className={className}>
            <em>{dayOfWeek}</em>
            <strong>{month}</strong>
            <span>{dayOfMonth}</span>
        </time>
    );
};

export default CalendarIcon;