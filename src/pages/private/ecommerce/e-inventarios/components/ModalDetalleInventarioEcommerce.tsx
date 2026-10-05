import React, { useEffect, useMemo, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
} from '@mui/material';

import { IoCloseOutline, IoImagesOutline } from 'react-icons/io5';

import {
    IInventarioEcommerceDetalle
} from '../../../../../interfaces/ecommerce.interface';

import {
    obtenerDetalleInventarioEcommerce
} from '../../../../../actions/ecommerce/ecommerce';

import LoadingSpinnerScreen from '../../../../../components/loadingSpinnerScreen/LoadingSpinnerScreen';
import { obtenerImagenesProductoPos } from '../../../../../actions/pos/pos';
import { DialogImagenesProducto } from '../../../../../components/product/dialog-imagenes-producto/DialogImagenesProducto';

interface Props {
    open: boolean;
    codigoModelo: string | null;
    onClose: () => void;
}

export const ModalDetalleInventarioEcommerce = ({
    open,
    codigoModelo,
    onClose,
}: Props) => {

    const [
        detalle,
        setDetalle
    ] = useState<IInventarioEcommerceDetalle[]>([]);

    const [productoSeleccionado, setProductoSeleccionado] = useState<any>(null);
    const [imagenes, setImagenes] = useState<string[]>([]);
    const [openImages, setOpenImages] = useState(false)

    const [ openLoadingSpinner,setOpenLoadingSpinner] = useState(false);

    useEffect(() => {

        if (!open || !codigoModelo) {
            setDetalle([]);
            return;
        }

        const cargarDetalle = async () => {

            try {

                setOpenLoadingSpinner(true);

                const response =
                    await obtenerDetalleInventarioEcommerce(
                        codigoModelo
                    );

                if (response?.error === 0) {

                    setDetalle(
                        response?.data || []
                    );

                } else {

                    setDetalle([]);

                }

            } catch (error) {

                console.error(
                    'Error obteniendo detalle inventario ecommerce:',
                    error
                );

                setDetalle([]);

            } finally {

                setOpenLoadingSpinner(false);

            }
        };

        cargarDetalle();

    }, [open, codigoModelo]);

    /**
     * Bodegas ecommerce
     */
    const bodegas = useMemo(() => {

        const mapa = new Map<number, string>();

        detalle.forEach((item) => {

            if (
                item.id_bodega !== null &&
                item.bodega
            ) {

                mapa.set(
                    item.id_bodega,
                    item.bodega
                );

            }

        });

        return Array.from(
            mapa,
            ([id, nombre]) => ({
                id,
                nombre,
            })
        );

    }, [detalle]);

    /**
     * Agrupar por color + talla
     */
    const filas = useMemo(() => {

        const mapa = new Map<string, any>();
        detalle.forEach((item) => {
            const key =`${item.codigo_color}-${item.talla}`;

            if (!mapa.has(key)) {

                mapa.set(key, {
                    codigo_color: item.codigo_color,
                    nombre_color:item.nombre_color,
                    color_rgb:item.color_rgb,
                    talla:item.talla,
                    bodegas: {},
                    total: 0,
                    codigo:item.codigo

                });

            }

            const fila = mapa.get(key);

            if (item.id_bodega !== null) {

                const stock =
                    Number(item.stock || 0);

                fila.bodegas[item.id_bodega] =
                    stock;

                fila.total += stock;

            }

        });

        return Array.from(
            mapa.values()
        );

    }, [detalle]);

    /**
     * Total ecommerce
     */
    const totalStock = useMemo(() => {

        return filas.reduce(
            (total, fila) =>
                total + fila.total,
            0
        );

    }, [filas]);

    const producto = detalle[0];

     const obtenerImagenesProducto = async (codigo:string) => {
            setOpenLoadingSpinner(true)
            let response = await obtenerImagenesProductoPos(codigo)
            setOpenLoadingSpinner(false)
            if (response?.error == 0) {
              setImagenes(response.imagenes)
              setOpenImages(true)
            }
        }

    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                fullWidth
                maxWidth="lg"
            >

                <DialogTitle>

                    <div className="flex items-center justify-between">

                        <div>

                            <div className="text-lg font-semibold">
                                Inventario Ecommerce
                            </div>

                            {producto && (
                                <div className="text-sm text-slate-500">
                                    {producto.descripcion}
                                </div>
                            )}

                        </div>

                        <IconButton
                            onClick={onClose}
                        >
                            <IoCloseOutline />
                        </IconButton>

                    </div>

                </DialogTitle>

                <DialogContent>

                    {producto && (

                        <div className="mb-5 flex flex-wrap gap-6 text-sm">

                            <div>
                                <span className="text-slate-500">
                                    Modelo:
                                </span>{' '}

                                <strong>
                                    {codigoModelo}
                                </strong>
                            </div>

                            <div>
                                <span className="text-slate-500">
                                    Categoría:
                                </span>{' '}

                                <strong>
                                    {producto.categoria}
                                </strong>
                            </div>

                            <div>
                                <span className="text-slate-500">
                                    Subcategoría:
                                </span>{' '}

                                <strong>
                                    {producto.sub_categoria}
                                </strong>
                            </div>

                        </div>

                    )}

                    {/* TOTAL */}

                    <div className="mb-5 rounded border border-slate-200 bg-slate-50 p-4">

                        <div className="text-sm text-slate-500">
                            Stock Ecommerce
                        </div>

                        <div className="text-2xl font-bold">
                            {totalStock} unidades
                        </div>

                    </div>

                    {/* DETALLE */}

                    <div className="overflow-x-auto">

                        <table className="w-full border-collapse text-sm">

                            <thead>

                                <tr className="border-b bg-slate-50">

                                    <th className="px-4 py-3 text-left">
                                        Color
                                    </th>

                                    <th className="px-4 py-3 text-left">
                                        Talla
                                    </th>

                                    {bodegas.map(
                                        (bodega) => (

                                            <th
                                                key={bodega.id}
                                                className="px-4 py-3 text-center"
                                            >
                                                {bodega.nombre}
                                            </th>

                                        )
                                    )}

                                    <th className="px-4 py-3 text-center">
                                        Imagenes
                                    </th>

                                    <th className="px-4 py-3 text-center">
                                        Total
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {filas.map(
                                    (fila, index) => (

                                        <tr
                                            key={index}
                                            className="border-b hover:bg-slate-50"
                                        >

                                            <td className="px-4 py-3">

                                                <div className="flex items-center gap-2">

                                                    <span
                                                        className="h-4 w-4 rounded-full border"
                                                        style={{
                                                            backgroundColor:
                                                                fila.color_rgb ||
                                                                '#FFFFFF',
                                                        }}
                                                    />

                                                    {fila.nombre_color ||
                                                        fila.codigo_color}

                                                </div>

                                            </td>

                                            <td className="px-4 py-3">
                                                {fila.talla}
                                            </td>

                                            {bodegas.map(
                                                (bodega) => (

                                                    <td
                                                        key={bodega.id}
                                                        className="px-4 py-3 text-center"
                                                    >
                                                        {fila.bodegas[
                                                            bodega.id
                                                        ] ?? 0}
                                                    </td>

                                                )
                                            )}

                                            

                                            <td className="px-4 py-3 text-center">
                                              
                                                <IconButton
                                                    color="primary"
                                                    onClick={() =>{
                                                        setProductoSeleccionado(fila)
                                                        obtenerImagenesProducto(fila.codigo)
                                                    }}
                                                >
                                                    <IoImagesOutline />
                                                </IconButton>
                                                                
                                            </td>

                                            <td className="px-4 py-3 text-center font-semibold">
                                                {fila.total}
                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                </DialogContent>
                <LoadingSpinnerScreen
                    open={openLoadingSpinner}
                />

            </Dialog>

            <DialogImagenesProducto
                images={imagenes}
                open={openImages}
                onClose={() => setOpenImages(false)}
                descripcion={productoSeleccionado?.descripcion}
                color={productoSeleccionado?.color_rgb || ''}
                nombreColor={productoSeleccionado?.nombre_color || ''}
                talla={productoSeleccionado?.talla || ''}
            />

            
        </>
    );
};