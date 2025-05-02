import React from 'react';
import { colors } from '../styles/theme';

const RangeInput = ({ value, onChange, min, max, step = 1, disabled = false }) => {
    return (
        <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={onChange}
            disabled={disabled}
            style={{
                width: '100%',
                height: '8px',
                borderRadius: '4px',
                background: disabled ? colors.light : `linear-gradient(to right, ${colors.primary} 0%, ${colors.primary} ${(value - min) / (max - min) * 100}%, ${colors.light} ${(value - min) / (max - min) * 100}%, ${colors.light} 100%)`,
                outline: 'none',
                opacity: disabled ? 0.7 : 1,
                cursor: disabled ? 'not-allowed' : 'pointer'
            }}
        />
    );
};

export default RangeInput;