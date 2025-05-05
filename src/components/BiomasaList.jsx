import React, { useState, useMemo } from 'react';
import { colors } from '../styles/theme';

const BiomasaList = ({ biomasas, onSelect, onDelete, selectedId }) => {
    const [filter, setFilter] = useState('');
    const [filterBy, setFilterBy] = useState('tipoBiomasa');
    const [selectedFilterValue, setSelectedFilterValue] = useState('');

    // Generar valores únicos para cada filtro (solo "Tipo" y "Estado")
    const uniqueValues = useMemo(() => {
        if (filterBy === 'tipoBiomasa') {
            return [...new Set(biomasas.map(biomasa => biomasa.tipoBiomasa))];
        }
        if (filterBy === 'estadoConservacion') {
            return [...new Set(biomasas.map(biomasa => biomasa.estadoConservacion))];
        }
        return [];
    }, [filterBy, biomasas]);

    // Filtrar biomasas si hay un valor seleccionado, o mostrar todas si no
    const filteredBiomasas = useMemo(() => {
        return biomasas.filter(biomasa => {
            const value = biomasa[filterBy]?.toString().toLowerCase();
            const filterValue = selectedFilterValue?.toLowerCase();
            const isFilterMatched = selectedFilterValue ? value === filterValue : true;
            return isFilterMatched && value?.includes(filter.toLowerCase());
        });
    }, [filter, selectedFilterValue, filterBy, biomasas]);

    return (
        <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '15px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            height: '100%',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <h3 style={{ marginTop: 0, color: colors.primary }}>Áreas de Biomasa</h3>

            <div style={{ marginBottom: '15px' }}>
                <input
                    type="text"
                    placeholder="Buscar biomasas..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '8px',
                        borderRadius: '4px',
                        border: `1px solid ${colors.lightGray}`
                    }}
                />
            </div>

            <div style={{ marginBottom: '15px', display: 'flex', gap: '10px' }}>
                <label>Filtrar por:</label>
                <select
                    value={filterBy}
                    onChange={(e) => {
                        setFilterBy(e.target.value);
                        setSelectedFilterValue(''); // Resetear la selección de valor al cambiar el filtro
                    }}
                    style={{ padding: '5px', borderRadius: '4px' }}
                >
                    <option value="tipoBiomasa">Tipo</option>
                    <option value="estadoConservacion">Estado</option>
                </select>
            </div>

            <div style={{ marginBottom: '15px' }}>
                {uniqueValues.length > 0 && (
                    <select
                        value={selectedFilterValue}
                        onChange={(e) => setSelectedFilterValue(e.target.value)}
                        style={{ padding: '5px', borderRadius: '4px' }}
                    >
                        <option value="">Seleccionar...</option> {/* Modificado aquí */}
                        {uniqueValues.map((value, index) => (
                            <option key={index} value={value}>
                                {value}
                            </option>
                        ))}
                    </select>
                )}
            </div>

            <div style={{ overflowY: 'auto', flex: 1 }}>
                {filteredBiomasas.length === 0 ? (
                    <p style={{ textAlign: 'center', color: colors.gray }}>No hay biomasas registradas</p>
                ) : (
                    <div style={{ display: 'grid', gap: '10px' }}>
                        {filteredBiomasas.map(biomasa => (
                            <div
                                key={biomasa.id}
                                onClick={() => onSelect(biomasa)}
                                style={{
                                    backgroundColor: selectedId === biomasa.id ? colors.lightPrimary : 'white',
                                    border: `1px solid ${colors.lightGray}`,
                                    borderRadius: '6px',
                                    padding: '10px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    ':hover': {
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                    }
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <strong style={{ color: colors.primary }}>
                                        {biomasa.tipoBiomasa}
                                    </strong>
                                    <span style={{ color: colors.gray }}>
                                        {new Date(biomasa.fecha).toLocaleDateString()}
                                    </span>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginTop: '5px'
                                }}>
                                    <span>Área: {biomasa.area} km²</span>
                                    <span style={{
                                        backgroundColor: getStatusColor(biomasa.estadoConservacion),
                                        color: 'white',
                                        padding: '2px 8px',
                                        borderRadius: '12px',
                                        fontSize: '0.8em'
                                    }}>
                                        {biomasa.estadoConservacion}
                                    </span>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(biomasa.id);
                                    }}
                                    style={{
                                        float: 'right',
                                        background: 'none',
                                        border: 'none',
                                        color: colors.danger,
                                        cursor: 'pointer',
                                        marginTop: '5px'
                                    }}
                                >
                                    Eliminar
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

function getStatusColor(status) {
    switch(status.toLowerCase()) {
        case 'excelente': return colors.success;
        case 'bueno': return colors.info;
        case 'regular': return colors.warning;
        case 'degradado': return colors.danger;
        default: return colors.gray;
    }
}

export default BiomasaList;
