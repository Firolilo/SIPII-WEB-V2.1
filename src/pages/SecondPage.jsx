// src/pages/Datos.jsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery } from '@apollo/client';
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import NavBar from '../components/NavBar';
import Button from '../components/Button';
import StatBox from '../components/StatBox';
import Loading from '../components/Loading';
import ErrorDisplay from '../components/ErrorDisplay';
import { GET_DETAILED_DATA } from '../graphql/queries';
import { colors, sizes } from '../styles/theme';
import Card from '../components/Card';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Datos = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    const { showNotification } = useNotification();
    const { loading, error, data } = useQuery(GET_DETAILED_DATA);

    const handleNavigate = (path) => {
        navigate(path);
    };

    if (loading) return <Loading />;
    if (error) return <ErrorDisplay error={error} />;

    const fireData = data?.getChiquitosFireRiskData[0];

    const chartData = {
        labels: ['Temperatura', 'Humedad', 'Viento', 'Precipitación', 'Sequía', 'Riesgo'],
        datasets: [{
            label: 'Niveles',
            data: [
                fireData?.weather.temperature,
                fireData?.weather.humidity,
                fireData?.weather.windSpeed,
                fireData?.weather.precipitation,
                fireData?.environmentalFactors.droughtIndex,
                fireData?.fireRisk
            ],
            backgroundColor: [
                colors.warning,
                colors.warning,
                colors.info,
                colors.info,
                colors.danger,
                fireData?.fireRisk > 70 ? colors.danger : fireData?.fireRisk > 40 ? colors.warning : colors.success
            ],
            borderColor: 'rgba(0, 0, 0, 0.1)',
            borderWidth: 1,
        }],
    };

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
                maxWidth: sizes.maxWidth,
                width: '100%',
                margin: '0 auto'
            }}>
                <h1 style={{
                    color: colors.primary,
                    marginBottom: '30px',
                    textAlign: 'center'
                }}>
                    Visualización de Datos
                </h1>

                <Card>
                    {/* Estadísticas principales */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                        gap: '15px',
                        marginBottom: '30px'
                    }}>
                        <StatBox
                            label="Temperatura"
                            value={`${fireData?.weather.temperature.toFixed(1)}°C`}
                            color={colors.warning}
                        />
                        <StatBox
                            label="Humedad"
                            value={`${fireData?.weather.humidity}%`}
                            color={colors.warning}
                        />
                        <StatBox
                            label="Viento"
                            value={`${fireData?.weather.windSpeed.toFixed(1)} m/s`}
                            color={colors.info}
                        />
                        <StatBox
                            label="Precipitación"
                            value={`${fireData?.weather.precipitation.toFixed(1)} mm`}
                            color={colors.info}
                        />
                        <StatBox
                            label="Sequía"
                            value={fireData?.environmentalFactors.droughtIndex.toFixed(1)}
                            color={colors.danger}
                        />
                        <StatBox
                            label="Riesgo"
                            value={`${fireData?.fireRisk.toFixed(1)}%`}
                            color={fireData?.fireRisk > 70 ? colors.danger : fireData?.fireRisk > 40 ? colors.warning : colors.success}
                        />
                    </div>

                    {/* Indicadores visuales */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginBottom: '20px',
                        padding: '15px',
                        backgroundColor: colors.light,
                        borderRadius: sizes.borderRadius
                    }}>
                        <p style={{ margin: 0, fontWeight: 'bold' }}>Indicadores:</p>
                        <div style={{
                            height: '20px',
                            width: '40px',
                            backgroundColor: colors.warning,
                            borderRadius: '4px'
                        }} />
                        <span>Temperatura/Humedad</span>
                        <div style={{
                            height: '20px',
                            width: '40px',
                            backgroundColor: colors.info,
                            borderRadius: '4px'
                        }} />
                        <span>Viento/Precipitación</span>
                        <div style={{
                            height: '20px',
                            width: '40px',
                            backgroundColor: colors.danger,
                            borderRadius: '4px'
                        }} />
                        <span>Sequía</span>
                        <div style={{
                            height: '20px',
                            width: '40px',
                            backgroundColor: fireData?.fireRisk > 70 ? colors.danger : fireData?.fireRisk > 40 ? colors.warning : colors.success,
                            borderRadius: '4px'
                        }} />
                        <span>Riesgo</span>
                    </div>

                    {/* Gráfico principal */}
                    <div style={{
                        height: '400px',
                        backgroundColor: 'white',
                        padding: '20px',
                        borderRadius: sizes.borderRadius,
                        boxShadow: sizes.boxShadow
                    }}>
                        <Bar
                            data={chartData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        labels: {
                                            color: colors.text,
                                            font: {
                                                weight: 'bold'
                                            }
                                        }
                                    },
                                    tooltip: {
                                        backgroundColor: colors.primary,
                                        titleColor: 'white',
                                        bodyColor: 'white',
                                        padding: 10,
                                        cornerRadius: sizes.borderRadius
                                    }
                                },
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        ticks: {
                                            color: colors.text
                                        },
                                        grid: {
                                            color: `${colors.text}10`
                                        }
                                    },
                                    x: {
                                        ticks: {
                                            color: colors.text,
                                            font: {
                                                weight: 'bold'
                                            }
                                        }
                                    }
                                }
                            }}
                        />
                    </div>
                </Card>
            </main>
        </div>
    );
};

export default Datos;