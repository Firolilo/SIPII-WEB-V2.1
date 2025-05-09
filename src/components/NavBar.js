// src/components/NavBar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Button from './Button';
import { colors } from '../styles/theme';

const NavBar = ({ user, onLogout }) => {
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const linkStyle = (path) => ({
        color: isActive(path) ? '#fff' : '#ffd6d6',
        textDecoration: 'none',
        fontWeight: isActive(path) ? 'bold' : 'normal',
        padding: '0.5rem 1rem',
        borderRadius: '6px',
        transition: 'all 0.3s ease',
        backgroundColor: isActive(path) ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
    });

    return (
        <nav
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem 2rem',
                backgroundColor: colors.secondary,
                color: 'white',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
            }}
        >
            <div style={{ display: 'flex', gap: '1rem' }}>
                <Link to="/dashboard" style={linkStyle('/dashboard')}>Inicio</Link>
                <Link to="/secondPage" style={linkStyle('/secondPage')}>Datos</Link>
                <Link to="/newPage" style={linkStyle('/newPage')}>Simulación</Link>
                <Link to="/reporte" style={linkStyle('/reporte')}>Reporte</Link>
                {user?.nombre === "Administrador" && (
                    <Link to="/users" style={linkStyle('/users')}>Usuarios</Link>
                )}
            </div>
            <Button onClick={onLogout} variant="secondary" size="small">
                Cerrar sesión
            </Button>
        </nav>
    );
};

export default NavBar;