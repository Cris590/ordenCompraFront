import React from 'react';
import { Chip, Typography } from '@mui/material';
import {
    IoCheckmarkCircleOutline,
    IoLockClosedOutline,
    IoReceiptOutline
} from 'react-icons/io5';
import { IPedidoEcommerceGestion } from '../../../../../interfaces/ecommerce.interface';

interface Props {
    pedido: IPedidoEcommerceGestion;
    gestionHabilitada: boolean;
}

const getEstadoColor = (
    codigo: string
): 'default' | 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info' => {
    switch (codigo) {
        case 'RECIBIDO':
            return 'info';
        case 'VALIDANDO':
            return 'warning';
        case 'CONFIRMADO':
            return 'primary';
        case 'PREPARANDO':
            return 'secondary';
        case 'ENVIANDO':
            return 'info';
        case 'ENTREGADO':
            return 'success';
        case 'CANCELADO':
            return 'error';
        case 'PAGO_FALLIDO':
            return 'error';
        case 'DEVUELTO':
            return 'warning';
        default:
            return 'default';
    }
};

export const GestionPedidoHeader = ({
    pedido,
    gestionHabilitada
}: Props) => {

    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">

            <div className="flex items-center gap-3">

                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                    <IoReceiptOutline size={25} />
                </div>

                <div>
                    <Typography
                        variant="h5"
                        fontWeight={700}
                    >
                        Gestión de pedido
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        {pedido.numero_pedido}
                    </Typography>
                </div>

            </div>

            <div className="flex items-center gap-3 flex-wrap">

                {/* Estado CRM */}
                <div className="flex flex-col items-start md:items-end">

                    <Typography
                        variant="caption"
                        color="text.secondary"
                        className="mb-1"
                    >
                        Estado actual
                    </Typography>

                    <Chip
                        label={pedido.codigo_estado_pedido}
                        color={getEstadoColor(pedido.codigo_estado_pedido)}
                        variant="filled"
                        sx={{
                            height: 38,
                            fontSize: '0.95rem',
                            fontWeight: 700,
                            px: 1,
                            '& .MuiChip-label': {
                                px: 1.5
                            }
                        }}
                    />

                    <Typography
                        variant="caption"
                        color="text.secondary"
                        className="mt-1"
                    >
                        {pedido.descripcion_estado_pedido}
                    </Typography>

                </div>

                {/* Estado WooCommerce */}
                <Chip
                    label={`WooCommerce: ${pedido.estado_woocommerce}`}
                    size="small"
                    variant="outlined"
                />

                {/* Estado de gestión */}
                <Chip
                    label={
                        gestionHabilitada
                            ? 'Gestión disponible'
                            : 'Pedido finalizado'
                    }
                    color={
                        gestionHabilitada
                            ? 'success'
                            : 'default'
                    }
                    icon={
                        gestionHabilitada
                            ? <IoCheckmarkCircleOutline />
                            : <IoLockClosedOutline />
                    }
                />

            </div>

        </div>
    );
};