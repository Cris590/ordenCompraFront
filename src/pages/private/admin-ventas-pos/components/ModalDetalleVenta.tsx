import React, { useEffect, useState } from "react";
import {
    Dialog,
    IconButton,
    Tooltip,
} from "@mui/material";

import {
    IoCloseOutline,
    IoCheckmarkCircleOutline,
    IoPersonOutline,
    IoStorefrontOutline,
    IoCalendarOutline,
    IoCardOutline,
    IoReceiptOutline,
} from "react-icons/io5";

import { IVentaDetallePOS, IVentaPOSAdmin } from "../../../../interfaces/pos.interface";
import { obtenerVentaDetalle } from "../../../../actions/pos/pos";
import LoadingSpinnerScreen from "../../../../components/loadingSpinnerScreen/LoadingSpinnerScreen";
import { formatDate } from "../../../../utils/formatDate";

interface Props {
    open: boolean;
    venta: IVentaPOSAdmin | null;
    onClose: () => void;
}

const formatMoney = (value: string | number) => {
    const numericValue =
        typeof value === "number"
            ? value
            : Number(
                String(value)
                    .replace(/\./g, "")
                    .replace(/,/g, "")
            );

    return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0,
    }).format(numericValue);
};


export const ModalDetalleVenta = ({
    open,
    venta,
    onClose,
}: Props) => {

    const [openLoadingSpinner, setOpenLoadingSpinner] = useState(false);
    const [ventaDetalle, setVentaDetalle] = useState<IVentaDetallePOS>()

    useEffect(() => {
        if (venta && venta.id) {
            cargarDetalleVenta(venta?.id)
        } else {
            onClose()
        }
    }, [venta])

    const cargarDetalleVenta = async (idVenta: number) => {
        setOpenLoadingSpinner(true);

        try {
            const resultado = await obtenerVentaDetalle(idVenta);
            setVentaDetalle(resultado?.venta);

        } catch (error) {
            console.error("Error cargando vendedores:", error);

        } finally {
            setOpenLoadingSpinner(false);
        }
    };



    return (

        <>

            <Dialog
                open={open}
                onClose={onClose}
                fullWidth
                maxWidth="lg"
                PaperProps={{
                    sx: {
                        borderRadius: "14px",
                        overflow: "hidden",
                        margin: "20px",
                        position: "relative",
                    },
                }}
            >
                <div className="bg-white">

                    {/* =====================================================
                    HEADER
                ====================================================== */}
                    <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-5 text-white">

                        <div className="flex items-start justify-between">

                            <div>
                                <div className="mb-1 flex items-center gap-2">
                                    <IoReceiptOutline
                                        size={22}
                                        className="text-cyan-400"
                                    />

                                    <span className="text-sm font-medium uppercase tracking-wider text-slate-300">
                                        Detalle de venta
                                    </span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <h2 className="text-2xl font-bold tracking-tight">
                                        #{ventaDetalle?.codigo}
                                    </h2>

                                    {ventaDetalle?.factura_valida === "1" && (
                                        <span className="flex items-center gap-1 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-400 ring-1 ring-emerald-500/30">
                                            <IoCheckmarkCircleOutline size={15} />
                                            Factura válida
                                        </span>
                                    )}
                                </div>
                            </div>

                            <Tooltip title="Cerrar">
                                <IconButton
                                    onClick={onClose}
                                    sx={{
                                        color: "white",
                                        backgroundColor:
                                            "rgba(255,255,255,0.08)",
                                        "&:hover": {
                                            backgroundColor:
                                                "rgba(255,255,255,0.15)",
                                        },
                                    }}
                                >
                                    <IoCloseOutline size={22} />
                                </IconButton>
                            </Tooltip>

                        </div>

                        <div className="mt-5 grid grid-cols-1 gap-4 border-t border-white/10 pt-4 sm:grid-cols-3">

                            <div className="flex items-center gap-3">
                                <div className="rounded-lg bg-white/10 p-2">
                                    <IoCalendarOutline
                                        size={18}
                                        className="text-cyan-400"
                                    />
                                </div>

                                <div>
                                    <p className="text-xs text-slate-400">
                                        Fecha
                                    </p>

                                    <p className="text-sm font-medium">
                                        {ventaDetalle && formatDate(ventaDetalle?.fecha)}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="rounded-lg bg-white/10 p-2">
                                    <IoStorefrontOutline
                                        size={18}
                                        className="text-cyan-400"
                                    />
                                </div>

                                <div>
                                    <p className="text-xs text-slate-400">
                                        Tienda
                                    </p>

                                    <p className="text-sm font-medium">
                                        {ventaDetalle?.tienda}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="rounded-lg bg-white/10 p-2">
                                    <IoPersonOutline
                                        size={18}
                                        className="text-cyan-400"
                                    />
                                </div>

                                <div>
                                    <p className="text-xs text-slate-400">
                                        Vendedor
                                    </p>

                                    <p className="text-sm font-medium">
                                        {ventaDetalle?.usuario}
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>


                    {/* =====================================================
                    CONTENIDO
                ====================================================== */}
                    <div className="max-h-[70vh] overflow-y-auto bg-slate-50">

                        <div className="space-y-5 p-6">

                            {/* =================================================
                            CLIENTE
                        ================================================== */}
                            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                                <div className="mb-4 flex items-center gap-2">
                                    <div className="rounded-lg bg-cyan-50 p-2">
                                        <IoPersonOutline
                                            size={19}
                                            className="text-cyan-600"
                                        />
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-bold text-slate-800">
                                            Información del cliente
                                        </h3>

                                        <p className="text-xs text-slate-400">
                                            Datos asociados a la venta
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                                    <div>
                                        <p className="mb-1 text-xs font-medium text-slate-400">
                                            Cliente
                                        </p>

                                        <p className="text-sm font-semibold text-slate-700">
                                            {ventaDetalle?.cliente}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="mb-1 text-xs font-medium text-slate-400">
                                            Documento
                                        </p>

                                        <p className="text-sm font-semibold text-slate-700">
                                            {ventaDetalle?.tipo_documento}{" "}
                                            {ventaDetalle?.documento_cliente}
                                        </p>
                                    </div>
                                </div>
                            </div>


                            {/* =================================================
                            PRODUCTOS
                        ================================================== */}
                            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

                                <div className="border-b border-slate-100 px-5 py-4">

                                    <div className="flex items-center justify-between">

                                        <div>
                                            <h3 className="text-sm font-bold text-slate-800">
                                                Productos
                                            </h3>

                                            <p className="mt-0.5 text-xs text-slate-400">
                                                {ventaDetalle?.total_productos}{" "}
                                                {ventaDetalle?.total_productos === 1
                                                    ? "producto"
                                                    : "productos"}{" "}
                                                en esta venta
                                            </p>
                                        </div>

                                        <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                                            {ventaDetalle?.total_productos} items
                                        </span>

                                    </div>
                                </div>


                                {/* TABLE */}
                                <div className="overflow-x-auto">

                                    <table className="w-full min-w-[700px] text-sm">

                                        <thead>
                                            <tr className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-400">

                                                <th className="px-5 py-3 font-semibold">
                                                    Producto
                                                </th>

                                                <th className="px-5 py-3 font-semibold">
                                                    Código
                                                </th>

                                                <th className="px-5 py-3 text-center font-semibold">
                                                    Cant.
                                                </th>

                                                <th className="px-5 py-3 text-right font-semibold">
                                                    Precio
                                                </th>

                                                <th className="px-5 py-3 text-right font-semibold">
                                                    Total
                                                </th>

                                            </tr>
                                        </thead>

                                        <tbody className="divide-y divide-slate-100">

                                            {ventaDetalle?.productos.map(
                                                (producto, index) => (
                                                    <tr
                                                        key={`${producto.codigo}-${index}`}
                                                        className="transition-colors hover:bg-slate-50"
                                                    >

                                                        <td className="px-5 py-4">
                                                            <div>
                                                                <p className="font-semibold text-slate-700">
                                                                    {
                                                                        producto.descripcion
                                                                    }
                                                                </p>
                                                            </div>
                                                        </td>

                                                        <td className="px-5 py-4">
                                                            <span className="rounded-md bg-slate-100 px-2 py-1 font-mono text-xs text-slate-500">
                                                                {
                                                                    producto.codigo
                                                                }
                                                            </span>
                                                        </td>

                                                        <td className="px-5 py-4 text-center font-medium text-slate-700">
                                                            {
                                                                producto.cantidad
                                                            }
                                                        </td>

                                                        <td className="px-5 py-4 text-right text-slate-600">
                                                            {formatMoney(
                                                                producto.precio
                                                            )}
                                                        </td>

                                                        <td className="px-5 py-4 text-right font-bold text-slate-800">
                                                            {formatMoney(
                                                                producto.total
                                                            )}
                                                        </td>

                                                    </tr>
                                                )
                                            )}

                                        </tbody>

                                    </table>

                                </div>
                            </div>


                            {/* =================================================
                            PARTE INFERIOR
                        ================================================== */}
                            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

                                {/* MÉTODOS DE PAGO */}
                                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                                    <div className="mb-4 flex items-center gap-2">

                                        <div className="rounded-lg bg-indigo-50 p-2">
                                            <IoCardOutline
                                                size={19}
                                                className="text-indigo-600"
                                            />
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-bold text-slate-800">
                                                Método de pago
                                            </h3>

                                            <p className="text-xs text-slate-400">
                                                Forma en que fue realizada la venta
                                            </p>
                                        </div>

                                    </div>

                                    <div className="space-y-3">

                                        {ventaDetalle?.metodo_pago.map(
                                            (metodo, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3"
                                                >

                                                    <div className="flex items-center gap-3">

                                                        <div className="h-2 w-2 rounded-full bg-indigo-500" />

                                                        <div>
                                                            <span className="text-sm font-medium capitalize text-slate-700">
                                                                {metodo.metodo_pago}
                                                            </span>

                                                            {metodo.codigo_transaccion && (
                                                                <div className="mt-0.5 text-xs text-slate-500">
                                                                    Código de venta:{" "}
                                                                    <span className="font-medium text-slate-700">
                                                                        {metodo.codigo_transaccion}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>

                                                    </div>

                                                    <span className="text-sm font-bold text-slate-800">
                                                        {formatMoney(metodo.valor)}
                                                    </span>

                                                </div>
                                            )
                                        )}

                                    </div>

                                </div>


                                {/* RESUMEN */}
                                <div className="rounded-xl bg-slate-900 p-5 text-white shadow-lg mb-6">

                                    <div className="mb-5">
                                        <h3 className="text-sm font-bold">
                                            Resumen de la venta
                                        </h3>

                                        <p className="text-xs text-slate-400">
                                            Valores registrados en el sistema
                                        </p>
                                    </div>

                                    <div className="space-y-3">

                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-400">
                                                Total productos
                                            </span>

                                            <span>
                                                {ventaDetalle && formatMoney(ventaDetalle?.total_sin_descuento)}
                                            </span>
                                        </div>

                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-400">
                                                Descuento
                                            </span>

                                            <span className="font-semibold text-rose-400">
                                                {ventaDetalle?.descuento}%
                                            </span>
                                        </div>

                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-400">
                                                Impuesto / IVA
                                            </span>

                                            <span>
                                                {ventaDetalle && formatMoney(ventaDetalle?.impuesto)}
                                            </span>
                                        </div>

                                        <div className="my-4 border-t border-white/10" />

                                        <div className="flex items-end justify-between">

                                            <div>
                                                <p className="text-xs text-slate-400">
                                                    Total a pagar
                                                </p>

                                                <p className="mt-1 text-2xl font-bold tracking-tight">
                                                    {ventaDetalle && formatMoney(ventaDetalle?.total)}
                                                </p>
                                            </div>

                                            <div className="rounded-lg bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-400">
                                                PAGADO
                                            </div>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* =====================================================
                    FOOTER
                ====================================================== */}
                    <div className="flex items-center justify-between border-t border-slate-200 bg-white px-6 py-4">

                        <p className="text-xs text-slate-400">
                            Factura #{ventaDetalle?.codigo}
                        </p>

                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg bg-slate-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400"
                        >
                            Cerrar
                        </button>

                    </div>

                </div>
                {/* <div className="absolute inset-0 z-[9999] flex items-center justify-center bg-white/80 backdrop-blur-sm"> */}
                <LoadingSpinnerScreen open={openLoadingSpinner} />
                {/* </div> */}
            </Dialog>
        </>
    );
};