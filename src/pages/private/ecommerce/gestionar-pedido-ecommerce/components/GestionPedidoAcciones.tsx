import React, { useState } from 'react';
import {
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    Typography
} from '@mui/material';
import {
    IoArrowForwardOutline,
    IoLockClosedOutline
} from 'react-icons/io5';
import {
    IEstadoPermitidoPedidoEcommerce,
    IPedidoEcommerceGestion
} from '../../../../../interfaces/ecommerce.interface';
import { ModalCambioEstadoPedido } from './ModalCambioEstadoPedido';

interface Props {
    pedido: IPedidoEcommerceGestion;
    estadosPermitidos: IEstadoPermitidoPedidoEcommerce[];
    gestionHabilitada: boolean;
    onActualizado: () => void;
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

export const GestionPedidoAcciones = ({
    pedido,
    estadosPermitidos,
    gestionHabilitada,
    onActualizado
}: Props) => {

    const [modalAbierto, setModalAbierto] = useState(false);

    return (
        <>
            <Card
                elevation={0}
                className="border mt-4"
            >
                <CardContent>

                    <Typography
                        variant="h6"
                        fontWeight={700}
                    >
                        Gestión del pedido
                    </Typography>

                    {!gestionHabilitada ? (

                        <div className="flex items-center gap-3 mt-4">

                            <IoLockClosedOutline size={22} />

                            <div>

                                <Typography fontWeight={600}>
                                    Pedido finalizado
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Este pedido se encuentra en un estado final
                                    y no permite nuevas gestiones.
                                </Typography>

                            </div>

                        </div>

                    ) : (

                        <>
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-4">

                                <div>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        className="mb-1"
                                    >
                                        Estado actual
                                    </Typography>

                                    <Chip
                                        label={pedido.descripcion_estado_pedido}
                                        color={getEstadoColor(
                                            pedido.codigo_estado_pedido
                                        )}
                                        sx={{
                                            fontWeight: 700
                                        }}
                                    />
                                </div>

                                <Button
                                    variant="contained"
                                    endIcon={<IoArrowForwardOutline />}
                                    onClick={() => setModalAbierto(true)}
                                    disabled={estadosPermitidos.length === 0}
                                >
                                    Cambiar estado
                                </Button>

                            </div>

                            {estadosPermitidos.length > 0 && (
                                <>
                                    <Divider className="!my-4" />

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        Estados disponibles: {estadosPermitidos.length}
                                    </Typography>
                                </>
                            )}
                        </>

                    )}

                </CardContent>
            </Card>

            <ModalCambioEstadoPedido
                open={modalAbierto}
                onClose={() => setModalAbierto(false)}
                pedido={pedido}
                estadosPermitidos={estadosPermitidos}
                onActualizado={onActualizado}
            />
        </>
    );
};