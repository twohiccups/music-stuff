import * as React from 'react';
import { NumberField } from '@base-ui-components/react/number-field';
import styles from './CustomNumberInput.module.css';

interface CustomNumberFieldProps {
    value: number;
    onChange: (value: number) => void;
}
export default function CustomNumberField({ value, onChange }: CustomNumberFieldProps) {
    const id = React.useId();

    return (
        <NumberField.Root
            id={id}
            value={value}
            onValueChange={(val) => {
                if (typeof val === 'number' && val > 0) {
                    onChange(val);
                }
            }}

            min={1}
            step={1}
            className={styles.Field}
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    (e.target as HTMLInputElement).blur(); // triggers onValueChange
                }
            }}
        >
            {/* Label without scrub behavior */}
            <label htmlFor={id} className={styles.Label}>
                Beat Number
            </label>

            <NumberField.Group className={styles.Group}>
                <NumberField.Decrement className={styles.Decrement}>
                    <MinusIcon />
                </NumberField.Decrement>
                <NumberField.Input className={styles.Input} />
                <NumberField.Increment className={styles.Increment}>
                    <PlusIcon />
                </NumberField.Increment>
            </NumberField.Group>
        </NumberField.Root>
    );
}

function PlusIcon(props: React.ComponentProps<'svg'>) {
    return (
        <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            stroke="currentcolor"
            strokeWidth="1.6"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path d="M0 5H5M10 5H5M5 5V0M5 5V10" />
        </svg>
    );
}

function MinusIcon(props: React.ComponentProps<'svg'>) {
    return (
        <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            stroke="currentcolor"
            strokeWidth="1.6"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path d="M0 5H10" />
        </svg>
    );
}
