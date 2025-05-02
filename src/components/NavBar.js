// src/components/NavBar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Button from './Button';
import { colors } from '../styles/theme';

const NavBar = ({ user, onLogout }) => {
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <nav style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem 2rem',
            backgroundColor: colors.primary,
            color: 'white',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
                <Link
                    to="/dashboard"
                    style={{
                        color: isActive('/dashboard') ? 'white' : '#e0e0e0',
                        textDecoration: 'none',
                        fontWeight: isActive('/dashboard') ? 'bold' : 'normal'
                    }}
                >
                    Inicio
                </Link>
                <Link
                    to="/secondPage"
                    style={{
                        color: isActive('/secondPage') ? 'white' : '#e0e0e0',
                        textDecoration: 'none',
                        fontWeight: isActive('/secondPage') ? 'bold' : 'normal'
                    }}
                >
                    Datos
                </Link>
                <Link
                    to="/newPage"
                    style={{
                        color: isActive('/newPage') ? 'white' : '#e0e0e0',
                        textDecoration: 'none',
                        fontWeight: isActive('/newPage') ? 'bold' : 'normal'
                    }}
                >
                    Simulación
                </Link>
                <Link
                    to="/reporte"
                    style={{
                        color: isActive('/reporte') ? 'white' : '#e0e0e0',
                        textDecoration: 'none',
                        fontWeight: isActive('/reporte') ? 'bold' : 'normal'
                    }}
                >
                    Reporte
                </Link>
                {user?.nombre === "Administrador" && (
                    <Link
                        to="/users"
                        style={{
                            color: isActive('/users') ? 'white' : '#e0e0e0',
                            textDecoration: 'none',
                            fontWeight: isActive('/users') ? 'bold' : 'normal'
                        }}
                    >
                        Usuarios
                    </Link>
                )}
            </div>
            <Button
                onClick={onLogout}
                variant="secondary"
                size="small"
            >
                Cerrar sesión
            </Button>
        </nav>
    );
};

export default NavBar;