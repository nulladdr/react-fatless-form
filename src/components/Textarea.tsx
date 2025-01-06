import React from "react";
import { useLabelStyle } from "../hooks/useLabelStyle";
import styles from './Textarea.module.css';
import globalStyles from './Global.module.css';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    name: string;
    label: string;
    error?: string;
    className?: string;
    style?: React.CSSProperties;
}

const DefaultTextarea: React.FC<TextareaProps> = ({
    name,
    label,
    error = '',
    className = '',
    style = {},
    ...rest
}) => {
    const [labelRef, dynamicStyles] = useLabelStyle(label);

    return (
        <>
            <div
                className={`${globalStyles.inputWrapper} ${className} ${error ? globalStyles.inputWrapperError : ""}`}
                style={{ ...dynamicStyles, ...style, height: "auto" }}
            >
                <label
                    ref={labelRef}
                    className={`${globalStyles.label} ${error ? globalStyles.errorLabel : ""}`}
                >
                    {label}
                </label>
                <textarea
                    id={name}
                    name={name}
                    {...rest}
                    className={styles.textArea}
                />
            </div>
            {error && <p className={globalStyles.errorMessage}>{error}</p>}
        </>
    );
};

export default DefaultTextarea;
