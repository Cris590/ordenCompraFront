import React from 'react';
import {
    Card,
    CardContent,
    Chip,
    Typography
} from '@mui/material';
import { IoCheckmarkCircleOutline } from 'react-icons/io5';
import { ISeguimientoPedidoEcommerce } from '../../../../../interfaces/ecommerce.interface';

interface Props {
    seguimientos: ISeguimientoPedidoEcommerce[];
}

export const GestionPedidoSeguimientos = ({
    seguimientos
}: Props) => {

    return (
        <Card elevation={0} className="border">

            <CardContent>

                <Typography
                    variant="h6"
                    fontWeight={700}
                    className="mb-4"
                >
                    Seguimiento
                </Typography>

                {seguimientos.length === 0 ? (

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        No hay seguimientos registrados.
                    </Typography>

                ) : (

                    <div className="space-y-0">

                        {seguimientos.map((seguimiento, index) => (

                            <div
                                key={`${seguimiento.codigo_estado}-${seguimiento.fecha_creacion}-${index}`}
                                className="flex gap-3"
                            >

                                <div className="flex flex-col items-center">

                                    <IoCheckmarkCircleOutline size={22} />

                                    {index < seguimientos.length - 1 && (
                                        <div className="w-px bg-gray-300 flex-1 my-1" />
                                    )}

                                </div>

                                <div className="pb-5">

                                    <div className="flex items-center gap-2 flex-wrap">

                                        <Chip
                                            label={seguimiento.descripcion_estado_pedido}
                                            size="small"
                                            variant="outlined"
                                        />

                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                        >
                                            {new Date(
                                                seguimiento.fecha_creacion
                                            ).toLocaleString()}
                                        </Typography>

                                    </div>

                                    {seguimiento.descripcion && (
                                        <Typography
                                            variant="body2"
                                            className="mt-2"
                                        >
                                            {seguimiento.descripcion}
                                        </Typography>
                                    )}

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </CardContent>

        </Card>
    );
};