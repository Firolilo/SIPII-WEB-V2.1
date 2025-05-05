// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery } from '@apollo/client';
import { GET_DASHBOARD_DATA } from '../graphql/queries';
import { MapContainer, TileLayer, Marker, Popup, Polygon, useMap } from "react-leaflet";
import L from 'leaflet';
import "leaflet/dist/leaflet.css";
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import NavBar from '../components/NavBar';
import StatBox from '../components/StatBox';
import Loading from '../components/Loading';
import ErrorDisplay from '../components/ErrorDisplay';
import { colors } from '../styles/theme';
import { getWeatherData } from '../services/weatherAPI';
import { getFireData } from '../services/firmsAPI';
import BiomasaList from "../components/BiomasaList";

// Configuración del icono para incendios
const fireIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

// Componente para manejar el redimensionamiento del mapa
function MapResizer() {
    const map = useMap();

    useEffect(() => {
        const timeout = setTimeout(() => {
            map.invalidateSize();
        }, 200);

        return () => clearTimeout(timeout);
    }, [map]);

    return null;
}

const Dashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    const { showNotification } = useNotification();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [biomasaData, setBiomasaData] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [editForm, setEditForm] = useState({
        tipoBiomasa: '',
        estadoConservacion: '',
        densidad: '',
        area: '',
        fecha: '',
        observaciones: ''
    });

    // Cargar datos de biomasa desde localStorage
    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem("biomasaReportes") || "[]");
        setBiomasaData(storedData);
        document.title = "Dashboard - SIPII";

        // Forzar redimensionamiento del mapa después de cargar los datos
        const timer = setTimeout(() => {
            const mapElement = document.querySelector('.leaflet-container');
            if (mapElement && mapElement._leaflet_map) {
                mapElement._leaflet_map.invalidateSize();
            }
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    // Manejar eliminación de reporte de biomasa
    const handleDeleteBiomasa = (index) => {
        const newBiomasaData = biomasaData.filter((_, i) => i !== index);
        setBiomasaData(newBiomasaData);
        localStorage.setItem("biomasaReportes", JSON.stringify(newBiomasaData));
        showNotification("Reporte de biomasa eliminado", "success");
    };

    // Manejar edición de reporte de biomasa
    const handleEditBiomasa = (index) => {
        setEditingIndex(index);
        setEditForm(biomasaData[index]);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({ ...prev, [name]: value }));
    };

    const handleCancelEdit = () => {
        setEditingIndex(null);
    };

    const handleSaveEdit = () => {
        const updatedData = [...biomasaData];
        updatedData[editingIndex] = editForm;
        setBiomasaData(updatedData);
        localStorage.setItem("biomasaReportes", JSON.stringify(updatedData));
        setEditingIndex(null);
        showNotification("Cambios guardados exitosamente", "success");
    };

    // Procesar datos de incendios
    const [weatherData, setWeatherData] = useState(null);
    const [fireData, setFireData] = useState([]);

    const defaultPosition = [-17.8, -61.5];

    useEffect(() => {
        const loadAllData = async () => {
            try {
                const weather = await getWeatherData(defaultPosition[0], defaultPosition[1]);
                setWeatherData(weather);

                const fires = await getFireData();
                setFireData(fires);
            } catch (err) {
                setError(err);
                showNotification("Error cargando datos", "error");
            } finally {
                setLoading(false);
            }
        };

        loadAllData();
    }, []);


    if (loading) return <Loading />;
    if (error) return <ErrorDisplay error={error} />;

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            backgroundColor: colors.background
        }}>
            <NavBar user={user} onLogout={logout} />

            <main style={{
                flex: 1,
                padding: '20px',
                maxWidth: '1200px',
                width: '100%',
                margin: '0 auto'
            }}>
                <h1 style={{
                    color: colors.primary,
                    marginBottom: '20px',
                    textAlign: 'center'
                }}>
                    SIPII - Sistema de Monitoreo
                </h1>

                {/* Contenedor del Mapa */}
                <div style={{
                    height: '500px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    marginBottom: '20px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    position: 'relative'
                }}>
                    <MapContainer
                        center={defaultPosition}
                        zoom={fireData.length > 0 ? 10 : 7}
                        scrollWheelZoom={true}
                        style={{ height: '100%', width: '100%' }}
                    >
                      <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                       <MapResizer />

                        {/* Marcador de incendio */}
                        {fireData.map((fire, index) => (
                            <Marker
                                key={`fire-${index}`}
                                position={[fire.lat, fire.lng]}
                                icon={fireIcon}
                            >
                                <Popup>
                                    <strong>Punto de calor detectado</strong><br />
                                    Fecha: {new Date(fire.date).toLocaleString()}<br />
                                    Confianza: {fire.confidence}
                                </Popup>
                            </Marker>
                        ))}

                        {/* Polígonos de biomasa */}
                        {biomasaData.map((reporte, index) => (
                            <Polygon
                                key={index}
                                positions={reporte.coordenadas}
                                color="#2e7d32"
                                fillColor="#66bb6a"
                                fillOpacity={0.5}
                            >
                                <Popup>
                                    {editingIndex === index ? (
                                        <div style={{ padding: '10px' }}>
                                            <div style={{ marginBottom: '10px' }}>
                                                <label style={{ display: 'block', marginBottom: '5px' }}>Tipo:</label>
                                                <input
                                                    type="text"
                                                    name="tipoBiomasa"
                                                    value={editForm.tipoBiomasa}
                                                    onChange={handleEditChange}
                                                    style={{ width: '100%', padding: '5px' }}
                                                />
                                            </div>
                                            <div style={{ marginBottom: '10px' }}>
                                                <label style={{ display: 'block', marginBottom: '5px' }}>Conservación:</label>
                                                <input
                                                    type="text"
                                                    name="estadoConservacion"
                                                    value={editForm.estadoConservacion}
                                                    onChange={handleEditChange}
                                                    style={{ width: '100%', padding: '5px' }}
                                                />
                                            </div>
                                            <div style={{ marginBottom: '10px' }}>
                                                <label style={{ display: 'block', marginBottom: '5px' }}>Densidad:</label>
                                                <input
                                                    type="text"
                                                    name="densidad"
                                                    value={editForm.densidad}
                                                    onChange={handleEditChange}
                                                    style={{ width: '100%', padding: '5px' }}
                                                />
                                            </div>
                                            <div style={{ marginBottom: '10px' }}>
                                                <label style={{ display: 'block', marginBottom: '5px' }}>Área (km²):</label>
                                                <input
                                                    type="text"
                                                    name="area"
                                                    value={editForm.area}
                                                    onChange={handleEditChange}
                                                    style={{ width: '100%', padding: '5px' }}
                                                />
                                            </div>
                                            <div style={{ marginBottom: '10px' }}>
                                                <label style={{ display: 'block', marginBottom: '5px' }}>Fecha:</label>
                                                <input
                                                    type="text"
                                                    name="fecha"
                                                    value={editForm.fecha}
                                                    onChange={handleEditChange}
                                                    style={{ width: '100%', padding: '5px' }}
                                                />
                                            </div>
                                            <div style={{ marginBottom: '10px' }}>
                                                <label style={{ display: 'block', marginBottom: '5px' }}>Observaciones:</label>
                                                <textarea
                                                    name="observaciones"
                                                    value={editForm.observaciones}
                                                    onChange={handleEditChange}
                                                    style={{ width: '100%', padding: '5px', minHeight: '60px' }}
                                                />
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <button
                                                    onClick={handleSaveEdit}
                                                    style={{
                                                        padding: '5px 10px',
                                                        backgroundColor: colors.success,
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    Guardar
                                                </button>
                                                <button
                                                    onClick={handleCancelEdit}
                                                    style={{
                                                        padding: '5px 10px',
                                                        backgroundColor: colors.danger,
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    Cancelar
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div style={{ padding: '10px' }}>
                                            <p><strong>Tipo:</strong> {reporte.tipoBiomasa}</p>
                                            <p><strong>Conservación:</strong> {reporte.estadoConservacion}</p>
                                            <p><strong>Densidad:</strong> {reporte.densidad}</p>
                                            <p><strong>Área:</strong> {reporte.area} km²</p>
                                            <p><strong>Fecha:</strong> {reporte.fecha}</p>
                                            <p><strong>Obs.:</strong> {reporte.observaciones || "Ninguna"}</p>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                                                <button
                                                    onClick={() => handleEditBiomasa(index)}
                                                    style={{
                                                        padding: '5px 10px',
                                                        backgroundColor: colors.warning,
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteBiomasa(index)}
                                                    style={{
                                                        padding: '5px 10px',
                                                        backgroundColor: colors.danger,
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </Popup>
                            </Polygon>
                        ))}
                    </MapContainer>
                </div>

                {/* Estadísticas */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: '20px',
                    marginBottom: '30px'
                }}>
                    <StatBox
                        label="Temperatura Actual"
                        value={`${weatherData?.current_weather?.temperature?.toFixed(1) || '--'}°C`}
                        color={colors.info}
                    />
                    <StatBox
                        label="Humedad"
                        value={`${weatherData?.hourly?.relative_humidity_2m?.[0] || '--'}%`}
                        color={colors.info}
                    />
                    <StatBox
                        label="Precipitación"
                        value={`${weatherData?.hourly?.precipitation?.[0] || '0'} mm`}
                        color={colors.info}
                    />
                    <StatBox
                        label="Puntos de calor"
                        value={fireData.length}
                        color={fireData.length > 0 ? colors.danger : colors.success}
                    />
                    <StatBox
                        label="Áreas de biomasa"
                        value={biomasaData.length}
                        color={colors.success}
                    />
                </div>

                <div style={{ marginBottom: '30px' }}>
                    <BiomasaList
                        biomasas={biomasaData.map((item, index) => ({ ...item, id: index }))}
                        onSelect={(biomasa) => console.log("Seleccionado:", biomasa)}
                        onDelete={(id) => handleDeleteBiomasa(id)}
                        selectedId={null}
                    />
                </div>

                {/* Detalles del incendio */}
                {fireData.length > 0 && (
                    <div style={{
                        backgroundColor: 'white',
                        padding: '20px',
                        borderRadius: '8px',
                        marginBottom: '20px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}>
                        <h3 style={{ color: colors.danger, marginTop: 0 }}>
                            Alertas de Incendios ({fireData.length})
                        </h3>
                        {fireData.map((fire, index) => (
                            <div key={`alert-${index}`} style={{ marginBottom: '10px' }}>
                                <p>
                                    <strong>Punto {index + 1}:</strong>
                                    Lat: {fire.lat.toFixed(4)}, Lng: {fire.lng.toFixed(4)}
                                </p>
                                <p>Confianza: {fire.confidence} - {new Date(fire.date).toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Dashboard;