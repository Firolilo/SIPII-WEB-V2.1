import React from 'react';
import { colors } from '../styles/theme';

const RangeInput = ({ value, onChange, min, max, step = 1, disabled = false }) => {
    // Estilo para el rango (barra)
    const rangeStyle = {
        width: '100%',
        height: '12px',
        borderRadius: '8px',
        background: disabled
            ? colors.light
            : `linear-gradient(to right, ${colors.primary} 0%, ${colors.primary} ${(value - min) / (max - min) * 100}%, ${colors.light} ${(value - min) / (max - min) * 100}%, ${colors.light} 100%)`,
        outline: 'none',
        opacity: disabled ? 0.7 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'background 0.3s ease', // Transición suave para el color del fondo
        boxShadow: `0 4px 10px rgba(0, 0, 0, 0.1)` // Agregar una sombra sutil
    };

    // Estilo para el "thumb" (el círculo que se mueve)
    const thumbStyle = {
        width: '20px',
        height: '20px',
        borderRadius: '50%', // Círculo perfecto
        background: colors.primary,
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'background 0.3s ease', // Transición suave para el thumb
        boxShadow: `0 2px 6px rgba(0, 0, 0, 0.2)`, // Sombra del thumb
        // Agregamos un efecto de "hover" cuando no está deshabilitado
        '&:hover': {
            background: colors.primaryDark // Cambia el color cuando pasa el ratón
        }
    };

    return (
        <div style={{ position: 'relative', width: '100%' }}>
            {/* Control deslizante */}
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={onChange}
                disabled={disabled}
                style={rangeStyle}
            />

            {/* Personalización del "thumb" (el círculo que se mueve) */}
            <div
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: `${(value - min) / (max - min) * 100}%`,
                    transform: 'translateX(-50%) translateY(-50%)', // Centrado exacto
                    ...thumbStyle
                }}
            ></div>
        </div>
    );
};

export default RangeInput;
