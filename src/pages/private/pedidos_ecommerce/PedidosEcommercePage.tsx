import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Tab,
    Tabs,
    Typography
} from '@mui/material';
import { PedidosFiltros } from './components/PedidosFiltros';
import { TablePedidos } from './components/TablePedidos';
import { FiltroBusquedaPedidosEcommerce } from '../../../interfaces/ecommerce.interface';
import { obtenerRangoMesActual } from '../../../utils/obtenerRangoMesActual';

export const PedidosEcommercePage = () => {

    const rangoMesActual = obtenerRangoMesActual();
    const [tab, setTab] = useState(0);
    const [filtros, setFiltros] =useState<FiltroBusquedaPedidosEcommerce>({
        estadoFinal: false,
        fechaDesde: rangoMesActual.fechaInicial,
        fechaHasta: rangoMesActual.fechaFinal,
    });
    const mostrarEstadosFinales = tab === 1;

    const handleChangeTab = (_: React.SyntheticEvent,nuevoValor: number) => {
        setTab(nuevoValor);
        setFiltros({ 
            estadoFinal: nuevoValor === 1,
            fechaDesde: rangoMesActual.fechaInicial,
            fechaHasta: rangoMesActual.fechaFinal,  
        });
    };

    return (
        <Box className='m-5'>

            {/* Tabs */}
            <Card
                elevation={0}
                sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    mb: 2,
                    marginRight:6
                }}
            >
                <Tabs
                    value={tab}
                    onChange={handleChangeTab}
                    sx={{
                        px: 2,
                        '& .MuiTab-root': {
                            minHeight: 52,
                            fontWeight: 600,
                            textTransform: 'none',
                            marginRight:6
                        }
                    }}
                >
                    <Tab label="Pendientes" />
                    <Tab label="Finalizados" />
                </Tabs>
            </Card>

            {/* Filtros */}
            
            <PedidosFiltros
                filtros={filtros}
                onChange={setFiltros}
                mostrarEstadosFinales={mostrarEstadosFinales}
            />

            {/* Tabla */}
            <TablePedidos filtros={filtros}/>
        </Box>
    );
};