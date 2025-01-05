import React from "react";
import { useLabelStyle } from "../hooks/useLabelStyle";
import styles from './DefaultInput.module.css';
import globalStyles from './Global.module.css';
import { InputProps } from "./Input";

const DefaultInput: React.FC<InputProps & { error?: string }> = ({
    name,
    type,
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
                style={{ ...dynamicStyles, ...style }}
            >
                <label
                    ref={labelRef}
                    className={`${globalStyles.label} ${error ? globalStyles.errorLabel : ""}`}
                >
                    {label}
                </label>
                <input
                    id={name}
                    name={name}
                    type={type}
                    {...rest}
                    className={styles.defaultInput}
                />
            </div>
            {error && <p className={globalStyles.errorMessage}>{error}</p>}
        </>
    );
}

export default DefaultInput;