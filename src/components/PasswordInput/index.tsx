import React, { useState } from "react";

import { useLabelStyle } from "hooks/useLabelStyle";
import globalStyles from '../Global.module.css';
import styles from "./PasswordInput.module.css";

export type PasswordInputProps = {
    name: string;
    value: string;
    onChange: (value: string) => void;
    passwordPolicy?: (password: string) => { strength: number; message: string };
    label: string;
    showStrengthIndicator?: boolean;
    showIcon?: React.ReactNode;
    hideIcon?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties,
    disabled?:boolean,
}

/**
 * PasswordInput Component
 * 
 * A controlled password input field with a visibility toggle and an optional strength indicator.
 * Supports a custom password policy function for validation.
 * Uses CSS Modules for styling.
 * 
 * @param {Object} props - Component properties
 * @param {string} props.value - The current password value
 * @param {Function} props.onChange - Function to update the password value
 * @param {(password: string) => { strength: number; message: string }} [props.passwordPolicy] - Custom password policy function
 * @param {boolean} [props.showStrengthIndicator=true] - Whether to show the strength indicator
 * @param {ReactNode} [props.showIcon] - Icon for showing the password
 * @param {ReactNode} [props.hideIcon] - Icon for hiding the password
 * @param {string} [props.className] - Additional CSS classes
 * 
 * @example
 * import { useState } from 'react';
 * import PasswordInput from './PasswordInput';
 * import { Eye, EyeOff } from 'lucide-react';
 * 
 * function App() {
 *   const [password, setPassword] = useState('');
 *   return (
 *     <PasswordInput 
 *       value={password} 
 *       onChange={setPassword} 
 *       showIcon={<Eye size={18} />} 
 *       hideIcon={<EyeOff size={18} />} 
 *     />
 *   );
 * }
 * 
 * export default App;
 */
export function PasswordInput({
  value,
  onChange,
  passwordPolicy = defaultPasswordPolicy,
  showStrengthIndicator = true,
  showIcon,
  hideIcon,
  className,
  label,
  style,
  error = '',
  disabled = false,
  ...rest
}: PasswordInputProps & {
    error?: string
}) {
  const [visible, setVisible] = useState(false);
  const { strength, message } = passwordPolicy(value);
  const [labelRef, dynamicStyles] = useLabelStyle(label)

  return (
    <>
        <div className={`${globalStyles.inputWrapper} ${className} ${error ? globalStyles.inputWrapperError : ""}`} style={{ ...dynamicStyles, ...style }}>
            <label
                ref={labelRef}
                className={`${globalStyles.label} ${error ? globalStyles.errorLabel : ""}`}
            >
                {label}
            </label>
            <input
                type={visible ? "text" : "password"}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={styles.passwordInput}
                {...rest}
            />
            <button
                type="button"
                onClick={() => setVisible(!visible)}
                disabled={disabled || !value}
                className={globalStyles.rightIcon}
            >
                <span>{visible ? hideIcon : showIcon}</span>
            </button>
        </div>
        {showStrengthIndicator && value && (
            <div className={styles.strengthContainer}>
                <div className={`${styles.strengthBar} ${strengthColors[strength]}`} />
                <p className={styles.strengthMessage}>{message}</p>
            </div>
        )}
        {error && <p className={globalStyles.errorMessage}>{error}</p>}
    </>
  );
}

const strengthColors = [
  styles.weak,
  styles.fair,
  styles.strong,
  styles.veryStrong,
];

function defaultPasswordPolicy(password: string) {
    let score = 0;
    if (password?.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
  
    // Ensure strength is always within bounds
    score = Math.min(score, 3);
  
    const messages = [
      "Poor. Use at least 8 characters, including uppercase, numbers, and symbols.",
      "Weak. Add more variety for better security.",
      "Acceptable. Consider using more special characters.",
      "Strong",
    ];
  
    return { strength: score, message: messages[score] };
}
