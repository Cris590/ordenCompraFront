import React, { useState } from 'react';
import {
    Card,
    CardContent,
    IconButton,
    Tooltip,
    Typography
} from '@mui/material';
import { IoImagesOutline } from 'react-icons/io5';

import { currencyFormat } from '../../../../../utils/currencyFormat';
import { IProductoPedidoEcommerce } from '../../../../../interfaces/ecommerce.interface';
import { ColorCircle } from '../../../../../components/product/color-circle/ColorCircle';
import { DialogImagenesProducto } from '../../../../../components/product/dialog-imagenes-producto/DialogImagenesProducto';


interface Props {
    productos: IProductoPedidoEcommerce[];
}

export const GestionPedidoProductos = ({
    productos
}: Props) => {

    const [productoSeleccionado, setProductoSeleccionado] = useState<IProductoPedidoEcommerce | null>(null);

    return (
        <>
            <Card
                elevation={0}
                className="mb-4 border border-gray-200"
            >
                <CardContent className="p-0">

                    <div className="px-5 py-4 border-b">
                        <Typography variant="h6" fontWeight={700}>
                            Productos
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            {productos.length} producto
                            {productos.length !== 1 ? 's' : ''}
                        </Typography>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b bg-gray-50">
                                    <th className="px-4 py-3 text-left text-sm font-semibold">
                                        Producto
                                    </th>

                                    <th className="px-4 py-3 text-left text-sm font-semibold">
                                        SKU
                                    </th>

                                    <th className="px-4 py-3 text-left text-sm font-semibold">
                                        Color
                                    </th>

                                    <th className="px-4 py-3 text-left text-sm font-semibold">
                                        Talla
                                    </th>

                                    <th className="px-4 py-3 text-center text-sm font-semibold">
                                        Cant.
                                    </th>

                                    <th className="px-4 py-3 text-right text-sm font-semibold">
                                        Precio
                                    </th>

                                    <th className="px-4 py-3 text-right text-sm font-semibold">
                                        Descuento
                                    </th>

                                    <th className="px-4 py-3 text-right text-sm font-semibold">
                                        Total
                                    </th>

                                    <th className="px-4 py-3 text-center text-sm font-semibold">
                                        Imagen
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {productos.map((producto, index) => (
                                    <tr
                                        key={`${producto.codigo}-${index}`}
                                        className="border-b last:border-b-0 hover:bg-gray-50"
                                    >
                                        {/* Producto */}
                                        <td className="px-4 py-4">
                                            <div>
                                                <Typography
                                                    fontWeight={600}
                                                    className="whitespace-nowrap"
                                                >
                                                    {producto.descripcion}
                                                </Typography>

                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                >
                                                    {producto.categoria}
                                                    {producto.sub_categoria
                                                        ? ` / ${producto.sub_categoria}`
                                                        : ''}
                                                </Typography>
                                            </div>
                                        </td>

                                        {/* SKU */}
                                        <td className="px-4 py-4">
                                            <Typography
                                                fontWeight={600}
                                                className="whitespace-nowrap"
                                            >
                                                {producto.codigo}
                                            </Typography>
                                        </td>

                                        {/* Color */}
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-2 whitespace-nowrap">
                                                {producto.color_rgb && (
                                                    <ColorCircle
                                                        color={producto.color_rgb}
                                                        size="2"
                                                    />
                                                )}

                                                <Typography variant="body2">
                                                    {producto.nombre_color ||
                                                        producto.color ||
                                                        '-'}
                                                </Typography>
                                            </div>
                                        </td>

                                        {/* Talla */}
                                        <td className="px-4 py-4">
                                            <Typography
                                                variant="body2"
                                                className="whitespace-nowrap"
                                            >
                                                {producto.talla || '-'}
                                            </Typography>
                                        </td>

                                        {/* Cantidad */}
                                        <td className="px-4 py-4 text-center">
                                            <Typography fontWeight={600}>
                                                {producto.cantidad}
                                            </Typography>
                                        </td>

                                        {/* Precio */}
                                        <td className="px-4 py-4 text-right whitespace-nowrap">
                                            {currencyFormat(producto.precio)}
                                        </td>

                                        {/* Descuento */}
                                        <td className="px-4 py-4 text-right whitespace-nowrap">
                                            {currencyFormat(producto.descuento)}
                                        </td>

                                        {/* Total */}
                                        <td className="px-4 py-4 text-right whitespace-nowrap">
                                            <Typography fontWeight={700}>
                                                {currencyFormat(producto.total)}
                                            </Typography>
                                        </td>

                                        {/* Imagen */}
                                        <td className="px-4 py-4 text-center">
                                            <IconButton
                                                color="primary"
                                                onClick={() =>
                                                    setProductoSeleccionado(producto)
                                                }
                                            >
                                                <IoImagesOutline />
                                            </IconButton>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </CardContent>
            </Card>

            <DialogImagenesProducto
                images={productoSeleccionado?.imagenes || []}
                open={productoSeleccionado !== null}
                onClose={() => setProductoSeleccionado(null)}
                descripcion={productoSeleccionado?.descripcion}
                color={productoSeleccionado?.color_rgb || ''}
                nombreColor={productoSeleccionado?.nombre_color || ''}
                talla={productoSeleccionado?.talla || ''}
            />
        </>
    );
};