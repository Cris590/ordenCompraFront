import React from 'react';
import { Card, CardContent, Divider, Typography } from '@mui/material';
import {
    IoCardOutline,
    IoLocationOutline,
    IoPersonOutline
} from 'react-icons/io5';
import { currencyFormat } from '../../../../../utils/currencyFormat';
import { IClienteEcommerceGestion, IDireccionEcommerceGestion, IPedidoEcommerceGestion } from '../../../../../interfaces/ecommerce.interface';

interface Props {
    pedido: IPedidoEcommerceGestion;
    cliente: IClienteEcommerceGestion | null;
    direccionFacturacion: IDireccionEcommerceGestion | null;
    direccionEnvio: IDireccionEcommerceGestion | null;
}

export const GestionPedidoResumen = ({
    pedido,
    cliente,
    direccionFacturacion,
    direccionEnvio
}: Props) => {

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">

            {/* Cliente */}
            <Card elevation={0} className="border">
                <CardContent>

                    <div className="flex items-center gap-2 mb-4">
                        <IoPersonOutline size={20} />

                        <Typography fontWeight={700}>
                            Cliente
                        </Typography>
                    </div>

                    <Typography fontWeight={600}>
                        {cliente?.nombre_cliente || '-'}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                        Documento: {cliente?.documento || '-'}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                        {cliente?.email || '-'}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                        {cliente?.telefono || '-'}
                    </Typography>

                </CardContent>
            </Card>

            {/* Direcciones */}
            <Card elevation={0} className="border">
                <CardContent>

                    <div className="flex items-center gap-2 mb-4">
                        <IoLocationOutline size={20} />

                        <Typography fontWeight={700}>
                            Direcciones
                        </Typography>
                    </div>

                    <Typography
                        variant="caption"
                        color="text.secondary"
                    >
                        ENVÍO
                    </Typography>

                    <Typography variant="body2">
                        {direccionEnvio?.direccion || '-'}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                        {direccionEnvio?.direccion_2 || ''}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                        {direccionEnvio?.ciudad || '-'}
                    </Typography>

                    <Divider className="!my-3" />

                    <Typography
                        variant="caption"
                        color="text.secondary"
                    >
                        FACTURACIÓN
                    </Typography>

                    <Typography variant="body2">
                        {direccionFacturacion?.direccion || '-'}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                        {direccionFacturacion?.ciudad || '-'}
                    </Typography>

                </CardContent>
            </Card>

            {/* Totales */}
            <Card elevation={0} className="border">
                <CardContent>

                    <div className="flex items-center gap-2 mb-4">
                        <IoCardOutline size={20} />

                        <Typography fontWeight={700}>
                            Resumen del pedido
                        </Typography>
                    </div>

                    <div className="space-y-2">

                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>
                                {currencyFormat(pedido.subtotal)}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span>Descuento</span>
                            <span>
                                {currencyFormat(pedido.descuento)}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span>Impuesto</span>
                            <span>
                                {currencyFormat(pedido.impuesto)}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span>Envío</span>
                            <span>
                                {currencyFormat(pedido.envio)}
                            </span>
                        </div>

                        <Divider />

                        <div className="flex justify-between text-lg">
                            <span className="font-bold">
                                Total
                            </span>

                            <span className="font-bold">
                                {currencyFormat(pedido.total)}
                            </span>
                        </div>

                    </div>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        className="!mt-3"
                    >
                        {pedido.metodo_pago || 'Sin método de pago'}
                    </Typography>

                </CardContent>
            </Card>

        </div>
    );
};