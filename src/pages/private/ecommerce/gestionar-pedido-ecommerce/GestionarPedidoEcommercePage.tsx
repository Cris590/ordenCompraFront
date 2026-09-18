import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

import { obtenerDetallePedidoEcommerce } from '../../../../actions/ecommerce/ecommerce';
import {
    IGestionPedidoEcommerce
} from '../../../../interfaces/ecommerce.interface';

import LoadingSpinnerScreen from '../../../../components/loadingSpinnerScreen/LoadingSpinnerScreen';
import { GestionPedidoHeader } from './components/GestionPedidoHeader';
import { GestionPedidoResumen } from './components/GestionPedidoResumen';
import { GestionPedidoProductos } from './components/GestionPedidoProductos';
import { GestionPedidoTransactions } from './components/GestionPedidoTransactions';
import { GestionPedidoSeguimientos } from './components/GestionPedidoSeguimientos';
import { GestionPedidoAcciones } from './components/GestionPedidoAcciones';

// import { GestionPedidoHeader } from './components/GestionPedidoHeader';
// import { GnPeestiodidoResumen } from './components/GestionPedidoResumen';
// import { GestionPedidoProductos } from './components/GestionPedidoProductos';
// import { GestionPedidoTransactions } from './components/GestionPedidoTransactions';
// import { GestionPedidoSeguimientos } from './components/GestionPedidoSeguimientos';
// import { GestionPedidoAcciones } from './components/GestionPedidoAcciones';

export const GestionarPedidoEcommercePage = () => {

    const { codPedido } = useParams();

    const [loading, setLoading] = useState(false);

    const [pedido, setPedido] =
        useState<IGestionPedidoEcommerce | null>(null);

    useEffect(() => {

        if (codPedido) {
            obtenerDetallePedido(+codPedido);
        }

    }, [codPedido]);

    const obtenerDetallePedido = async (codPedido: number) => {

        try {

            setLoading(true);
            const response = await obtenerDetallePedidoEcommerce(codPedido);
            if (response && response.error == 0) {
                setPedido(response);
            }

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }
    };

    if (loading) {
        return (
            <LoadingSpinnerScreen open={true} />
        );
    }

    if (!pedido) {
        return (
            <Box className="m-5">
                <Typography>
                    No se encontró la información del pedido.
                </Typography>
            </Box>
        );
    }

    const gestionHabilitada = !pedido.pedido.estado_final;

    return (
        <Box className="m-5 me-10">

            <GestionPedidoHeader
                pedido={pedido.pedido}
                gestionHabilitada={gestionHabilitada}
            />

            <GestionPedidoResumen
                pedido={pedido.pedido}
                cliente={pedido.cliente}
                direccionFacturacion={pedido.direccionFacturacion}
                direccionEnvio={pedido.direccionEnvio}
            />

            <GestionPedidoProductos
                productos={pedido.productos}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                <GestionPedidoTransactions
                    transactions={pedido.transactions}
                />

                <GestionPedidoSeguimientos
                    seguimientos={pedido.seguimientos}
                />

            </div>

            <GestionPedidoAcciones
                pedido={pedido.pedido}
                estadosPermitidos={pedido.estadosPermitidos}
                gestionHabilitada={gestionHabilitada}
                onActualizado={() => {
                    if (codPedido) {
                        obtenerDetallePedido(+codPedido);
                    }
                }}
            />

            <LoadingSpinnerScreen open={loading} />

        </Box>
    );
};