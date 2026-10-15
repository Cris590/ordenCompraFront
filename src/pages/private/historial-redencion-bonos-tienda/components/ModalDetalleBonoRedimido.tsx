
import { useEffect, useState, type ReactNode } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import {
    IoCloseOutline,
    IoPersonOutline,
    IoCalendarOutline,
    IoCardOutline,
    IoTicketOutline,
    IoShirtOutline,
    IoReceiptOutline,
    IoBusinessOutline,
    IoDocumentTextOutline,
    IoWalletOutline,
    IoRefreshOutline
} from 'react-icons/io5';

import { obtenerDetalleBonoRedimidosTienda } from '../../../../actions/entidad_bono/entidad_bono';
import LoadingSpinnerScreen from '../../../../components/loadingSpinnerScreen/LoadingSpinnerScreen';
import { IBonoRedimidoDetalle } from '../../../../interfaces/redencion_bonos.interface';

interface Props {
    open: boolean;
    onClose: () => void;
    codRedencionBono: number | undefined;
}

const formatoMoneda = (valor: number | string) =>
    new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0
    }).format(Number(valor) || 0);

const formatoFecha = (fecha: string) =>
    new Date(fecha).toLocaleString('es-CO', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

const Seccion = ({
    titulo,
    icono,
    children
}: {
    titulo: string;
    icono: ReactNode;
    children: ReactNode;
}) => (
    <section className="space-y-3">
        <div className="flex items-center gap-2">
            <span className="text-gray-500">{icono}</span>
            <h3 className="text-sm font-semibold text-gray-800">
                {titulo}
            </h3>
        </div>

        {children}
    </section>
);

const Dato = ({
    etiqueta,
    valor
}: {
    etiqueta: string;
    valor: ReactNode;
}) => (
    <div className="min-w-0 space-y-1">
        <p className="text-xs text-gray-500">{etiqueta}</p>
        <div className="break-words text-sm font-medium text-gray-800">
            {valor ?? '—'}
        </div>
    </div>
);

export const ModalDetalleBonoRedimido = ({
    open,
    onClose,
    codRedencionBono
}: Props) => {
    const [bonoRedimido, setBonoRedimido] =
        useState<IBonoRedimidoDetalle | null>(null);

    const [openLoadingSpinner, setOpenLoadingSpinner] =
        useState(false);

    const [errorConsulta, setErrorConsulta] = useState('');

    useEffect(() => {
        if (!open || !codRedencionBono) return;

        let cancelado = false;

        const consultarDetalle = async () => {
            setOpenLoadingSpinner(true);
            setErrorConsulta('');
            setBonoRedimido(null);

            try {
                const respuesta =
                    await obtenerDetalleBonoRedimidosTienda(
                        codRedencionBono
                    );

                if (cancelado) return;

                if (
                    !respuesta ||
                    respuesta.error !== 0 ||
                    !respuesta.bonoDetalle
                ) {
                    setErrorConsulta(
                        'No fue posible obtener el detalle de la redención.'
                    );
                    return;
                }

                setBonoRedimido(respuesta.bonoDetalle);
            } catch (error) {
                if (cancelado) return;

                console.error(
                    'Error al consultar el detalle del bono redimido:',
                    error
                );

                setErrorConsulta(
                    'Ocurrió un error al consultar el detalle. Intenta nuevamente.'
                );
            } finally {
                if (!cancelado) {
                    setOpenLoadingSpinner(false);
                }
            }
        };

        consultarDetalle();

        return () => {
            cancelado = true;
        };
    }, [open, codRedencionBono]);

    const consultarNuevamente = async () => {
        if (!codRedencionBono) return;

        setOpenLoadingSpinner(true);
        setErrorConsulta('');
        setBonoRedimido(null);

        try {
            const respuesta =
                await obtenerDetalleBonoRedimidosTienda(
                    codRedencionBono
                );

            if (
                !respuesta ||
                respuesta.error !== 0 ||
                !respuesta.bonoDetalle
            ) {
                setErrorConsulta(
                    'No fue posible obtener el detalle de la redención.'
                );
                return;
            }

            setBonoRedimido(respuesta.bonoDetalle);
        } catch (error) {
            console.error(error);

            setErrorConsulta(
                'Ocurrió un error al consultar el detalle. Intenta nuevamente.'
            );
        } finally {
            setOpenLoadingSpinner(false);
        }
    };

    const detalle = bonoRedimido;

    const cantidadTotal =
        detalle?.productos.reduce(
            (total, producto) =>
                total + Number(producto.cantidad || 0),
            0
        ) ?? 0;

    const bonos = (detalle?.bonos ?? []) as (
        IBonoRedimidoDetalle['bonos'][number] & {
            cod_cargo_entidad?: number | string;
        }
    )[];

    // Agrupar los bonos por cargo de entidad.
    const bonosAgrupados = Array.from(
        bonos.reduce(
            (grupos, bono) => {
                const clave =
                    bono.cod_cargo_entidad != null
                        ? String(bono.cod_cargo_entidad)
                        : `registro-${bono.cod_usuario_bono_entrega}`;

                const grupo = grupos.get(clave);

                if (grupo) {
                    grupo.bonos.push(bono);
                    grupo.valorTotal += Number(bono.valor || 0);
                } else {
                    grupos.set(clave, {
                        codCargoEntidad: bono.cod_cargo_entidad,
                        cargoEntidad: bono.cargo_entidad,
                        bonos: [bono],
                        valorTotal: Number(bono.valor || 0)
                    });
                }

                return grupos;
            },
            new Map<
                string,
                {
                    codCargoEntidad?: number | string;
                    cargoEntidad: string;
                    bonos: typeof bonos;
                    valorTotal: number;
                }
            >()
        ).values()
    );

    // Total de los bonos utilizados.
    const totalBonos = bonos.reduce(
        (total, bono) => total + Number(bono.valor || 0),
        0
    );

    // Total pagado con otros métodos de pago.
    const totalOtrosMedios = (
        detalle?.metodos_pago ?? []
    ).reduce(
        (total, metodo) =>
            total + Number(metodo.valor || 0),
        0
    );

    // El campo subtotal corresponde al valor antes del descuento.
    const subtotalAntesDescuento = Number(
        detalle?.subtotal || 0
    );

    // El descuento recibido representa un porcentaje.
    const porcentajeDescuento = Number(
        detalle?.descuento || 0
    );

    const valorDescuento =
        subtotalAntesDescuento *
        (porcentajeDescuento / 100);

    const subtotalConDescuento =
        subtotalAntesDescuento - valorDescuento;

    return (
        <>


            <Dialog
                open={open}
                onClose={onClose}
                fullWidth
                maxWidth="xl"
                scroll="paper"
                aria-labelledby="titulo-detalle-bono"
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        maxHeight: '92vh',
                        backgroundColor: '#f9fafb'
                    }
                }}
            >
                <LoadingSpinnerScreen open={openLoadingSpinner} />
                {/* Encabezado */}
                <DialogTitle sx={{ p: 0 }}>
                    <div className="flex items-center justify-between gap-4 border-b border-gray-200 bg-white px-5 py-4 sm:px-7">
                        <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                <IoReceiptOutline size={26} />
                            </div>

                            <div className="min-w-0">
                                <h2
                                    id="titulo-detalle-bono"
                                    className="text-lg font-bold text-gray-900 sm:text-xl"
                                >
                                    Redención #{codRedencionBono}
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    Detalle de la redención de bonos
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Cerrar modal"
                            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                        >
                            <IoCloseOutline size={25} />
                        </button>
                    </div>
                </DialogTitle>

                <DialogContent dividers sx={{ p: 0, borderBottom: 0 }}>
                    {/* Error de consulta */}
                    {errorConsulta && !openLoadingSpinner && (
                        <div className="m-5 rounded-xl border border-red-200 bg-red-50 p-5 sm:m-7 sm:mb-0">
                            <p className="text-sm font-medium text-red-700">
                                {errorConsulta}
                            </p>

                            <button
                                type="button"
                                onClick={consultarNuevamente}
                                className="mt-3 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                            >
                                <IoRefreshOutline size={17} />
                                Intentar nuevamente
                            </button>
                        </div>
                    )}

                    {detalle && (
                        <div className="space-y-7 p-5 sm:p-7">
                            {/* Tarjetas de resumen */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                                <div className="rounded-xl border border-gray-200 bg-white p-4">
                                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                        Total pagado
                                    </p>

                                    <p className="mt-2 text-2xl font-bold text-emerald-700">
                                        {formatoMoneda(detalle.total_pagado)}
                                    </p>

                                    <p className="mt-1 text-xs text-gray-500">
                                        Pago total registrado
                                    </p>
                                </div>

                                <div className="rounded-xl border border-gray-200 bg-white p-4">
                                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                        Valor de los bonos
                                    </p>

                                    <p className="mt-2 text-2xl font-bold text-indigo-700">
                                        {formatoMoneda(totalBonos)}
                                    </p>

                                    <p className="mt-1 text-xs text-gray-500">
                                        {detalle.bonos.length}{' '}
                                        {detalle.bonos.length === 1
                                            ? 'bono'
                                            : 'bonos'}
                                    </p>
                                </div>

                                <div className="rounded-xl border border-gray-200 bg-white p-4">
                                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                        Total pagado otros medios
                                    </p>

                                    <p className="mt-2 text-2xl font-bold text-sky-700">
                                        {formatoMoneda(totalOtrosMedios)}
                                    </p>

                                    <p className="mt-1 text-xs text-gray-500">
                                        Otros métodos de pago
                                    </p>
                                </div>

                                <div className="rounded-xl border border-gray-200 bg-white p-4">
                                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                        Productos
                                    </p>

                                    <p className="mt-2 text-2xl font-bold text-gray-900">
                                        {cantidadTotal}
                                    </p>

                                    <p className="mt-1 text-xs text-gray-500">
                                        Unidades · {detalle.productos.length}{' '}
                                        {detalle.productos.length === 1
                                            ? 'referencia'
                                            : 'referencias'}
                                    </p>
                                </div>
                            </div>

                            {/* Información del cliente y entidad */}
                            <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
                                <Seccion
                                    titulo="Información del cliente"
                                    icono={<IoPersonOutline size={19} />}
                                >
                                    <div className="grid grid-cols-1 gap-4 rounded-xl border border-gray-200 bg-white p-4 sm:grid-cols-2">
                                        <Dato
                                            etiqueta="Nombre del cliente"
                                            valor={detalle.nombre_cliente}
                                        />

                                        <Dato
                                            etiqueta="Documento"
                                            valor={detalle.documento_cliente}
                                        />

                                        <Dato
                                            etiqueta="Fecha de redención"
                                            valor={formatoFecha(detalle.fecha_creacion)}
                                        />

                                        <Dato
                                            etiqueta="Registrado por"
                                            valor={detalle.nombre_usuario}
                                        />

                                        <Dato
                                            etiqueta="Documento del usuario"
                                            valor={detalle.documento_usuario}
                                        />

                                        <Dato
                                            etiqueta="Código de redención"
                                            valor={
                                                <span className="inline-flex rounded-md bg-indigo-50 px-2.5 py-1 font-mono text-sm font-bold text-indigo-700">
                                                    #{detalle.cod_redencion_bono_tienda}
                                                </span>
                                            }
                                        />
                                    </div>
                                </Seccion>

                                <Seccion
                                    titulo="Entidad y tienda"
                                    icono={<IoBusinessOutline size={19} />}
                                >
                                    <div className="grid grid-cols-1 gap-4 rounded-xl border border-gray-200 bg-white p-4 sm:grid-cols-2">
                                        <Dato
                                            etiqueta="Entidad"
                                            valor={detalle.entidad}
                                        />

                                        <Dato
                                            etiqueta="NIT"
                                            valor={detalle.nit}
                                        />

                                        <Dato
                                            etiqueta="Tienda"
                                            valor={detalle.tienda}
                                        />

                                        <Dato
                                            etiqueta="Número de contrato"
                                            valor={detalle.no_contrato}
                                        />

                                        <div className="space-y-2 sm:col-span-2">
                                            <p className="text-xs text-gray-500">
                                                Códigos redimidos
                                            </p>

                                            <div className="flex flex-wrap gap-2">
                                                {detalle.usuarios.map(
                                                    (usuario, index) => (
                                                        <span
                                                            key={`${usuario.codigo}-${index}`}
                                                            className="inline-flex items-center rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 font-mono text-sm font-bold tracking-wide text-indigo-800"
                                                        >
                                                            {usuario.codigo}
                                                        </span>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Seccion>
                            </div>

                            {/* Bonos asociados */}
                            <Seccion
                                titulo="Bonos asociados"
                                icono={<IoTicketOutline size={19} />}
                            >
                                <div className="space-y-3">
                                    {bonosAgrupados.map((grupo) => (
                                        <div
                                            key={String(
                                                grupo.codCargoEntidad ??
                                                grupo.bonos[0].cod_usuario_bono_entrega
                                            )}
                                            className="overflow-hidden rounded-lg border border-gray-200 bg-white"
                                        >
                                            <div className="flex items-center justify-between gap-3 border-b border-gray-100 bg-gray-50 px-3 py-2.5 sm:px-4">
                                                <div className="flex min-w-0 items-center gap-2">
                                                    <span className="text-sm font-semibold text-gray-800">
                                                        {grupo.cargoEntidad}
                                                    </span>

                                                    {grupo.codCargoEntidad != null && (
                                                        <span className="text-xs text-gray-400">
                                                            ID {grupo.codCargoEntidad}
                                                        </span>
                                                    )}
                                                </div>

                                                <span className="shrink-0 text-sm font-bold text-gray-900">
                                                    {formatoMoneda(grupo.valorTotal)}
                                                </span>
                                            </div>

                                            <div className="divide-y divide-gray-100">
                                                {grupo.bonos.map((bono) => (
                                                    <div
                                                        key={bono.cod_usuario_bono_entrega}
                                                        className="flex items-start justify-between gap-3 px-3 py-2.5 sm:px-4"
                                                    >
                                                        <div className="min-w-0 flex-1">
                                                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                                                <span className="text-xs font-semibold uppercase tracking-wide text-indigo-700">
                                                                    {bono.cargo_bono_producto}
                                                                </span>

                                                                <span className="text-sm text-gray-700">
                                                                    {bono.descripcion_bono_producto}
                                                                </span>
                                                            </div>

                                                            <p className="mt-1 break-all font-mono text-xs text-gray-500">
                                                                {bono.codigo_bono}
                                                            </p>
                                                        </div>

                                                        <span className="shrink-0 pt-0.5 text-sm font-semibold text-gray-800">
                                                            {formatoMoneda(bono.valor)}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Seccion>

                            {/* Productos */}
                            <Seccion
                                titulo="Productos de la redención"
                                icono={<IoShirtOutline size={19} />}
                            >

                                <div className="overflow-hidden rounded-xl border border-gray-300 bg-white shadow-sm">
                                    <div className="hidden grid-cols-[minmax(0,1fr)_100px_140px_140px] items-center gap-3 border-b border-gray-200 bg-gray-100 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 sm:grid">
                                        <span>Producto</span>
                                        <span className="text-right">Cantidad</span>
                                        <span className="text-right">Precio</span>
                                        <span className="text-right">Total</span>
                                    </div>

                                    <div className="divide-y divide-gray-100">
                                        {detalle.productos.map((producto) => (
                                            <div
                                                key={producto.id}
                                                className="grid grid-cols-1 gap-3 px-4 py-3 sm:grid-cols-[minmax(0,1fr)_100px_140px_140px] sm:items-center"
                                            >
                                                <div className="min-w-0">
                                                    <p className="text-sm font-bold text-gray-900 sm:text-base">
                                                        {producto.nombre}
                                                    </p>

                                                    <p className="mt-1 break-all text-xs text-gray-600">
                                                        Código:{' '}
                                                        <span className="font-mono font-semibold text-gray-800">
                                                            {producto.codigo}
                                                        </span>
                                                    </p>

                                                    <p className="mt-1 text-xs text-gray-500">
                                                        Stock disponible:{' '}
                                                        <span className="font-semibold text-gray-700">
                                                            {producto.stock}
                                                        </span>
                                                    </p>
                                                </div>

                                                <div className="text-right">
                                                    <Dato
                                                        etiqueta="Cantidad"
                                                        valor={producto.cantidad}
                                                    />
                                                </div>

                                                <div className="text-right">
                                                    <Dato
                                                        etiqueta="Precio unitario"
                                                        valor={formatoMoneda(producto.precio)}
                                                    />
                                                </div>

                                                <div className="text-right">
                                                    <Dato
                                                        etiqueta="Total"
                                                        valor={formatoMoneda(
                                                            Number(producto.precio) *
                                                            Number(producto.cantidad)
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                            </Seccion>

                            {/* Métodos de pago */}
                            <Seccion
                                titulo="Métodos de pago"
                                icono={<IoWalletOutline size={19} />}
                            >
                                {detalle.metodos_pago.length === 0 ? (
                                    <div className="rounded-xl border border-dashed border-gray-300 bg-white p-5 text-center">
                                        <IoCardOutline
                                            size={25}
                                            className="mx-auto text-gray-400"
                                        />

                                        <p className="mt-2 text-sm font-medium text-gray-600">
                                            No hay pagos registrados por otros medios.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        {detalle.metodos_pago.map((metodo) => (
                                            <div
                                                key={metodo.id_metodo_pago}
                                                className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-4"
                                            >
                                                <div className="flex min-w-0 items-center gap-3">
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
                                                        <IoCardOutline size={21} />
                                                    </div>

                                                    <div>
                                                        <p className="text-sm font-semibold text-gray-900">
                                                            {metodo.nombre}
                                                        </p>

                                                        <p className="text-xs text-gray-500">
                                                            Código: {metodo.codigo}
                                                        </p>
                                                    </div>
                                                </div>

                                                <p className="shrink-0 text-sm font-bold text-gray-900">
                                                    {formatoMoneda(metodo.valor)}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </Seccion>

                            {/* Resumen financiero */}
                            <Seccion
                                titulo="Resumen financiero"
                                icono={<IoDocumentTextOutline size={19} />}
                            >
                                <div className="rounded-xl border border-gray-200 bg-white p-5">
                                    <div className="ml-auto max-w-md space-y-4">
                                        <div className="flex justify-between gap-4 text-sm">
                                            <span className="text-gray-500">
                                                Valor antes del descuento
                                            </span>

                                            <span className="font-medium text-gray-800">
                                                {formatoMoneda(subtotalAntesDescuento)}
                                            </span>
                                        </div>

                                        <div className="flex justify-between gap-4 text-sm">
                                            <span className="text-gray-500">
                                                Descuento ({porcentajeDescuento}%)
                                            </span>

                                            <span className="font-semibold text-red-600">
                                                -{formatoMoneda(valorDescuento)}
                                            </span>
                                        </div>

                                        <div className="flex justify-between gap-4 text-sm">
                                            <span className="text-gray-500">
                                                Subtotal con descuento
                                            </span>

                                            <span className="font-medium text-gray-800">
                                                {formatoMoneda(subtotalConDescuento)}
                                            </span>
                                        </div>

                                        <div className="flex justify-between gap-4 text-sm">
                                            <span className="text-gray-500">
                                                Impuesto
                                            </span>

                                            <span className="font-medium text-gray-800">
                                                {formatoMoneda(detalle.impuesto)}
                                            </span>
                                        </div>

                                        <div className="border-t border-dashed border-gray-200 pt-4">
                                            <div className="flex justify-between gap-4">
                                                <span className="font-semibold text-gray-900">
                                                    Total
                                                </span>

                                                <span className="text-lg font-bold text-gray-900">
                                                    {formatoMoneda(detalle.total)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex justify-between gap-4 text-sm">
                                            <span className="text-gray-500">
                                                Pagado con bonos
                                            </span>

                                            <span className="font-medium text-indigo-700">
                                                {formatoMoneda(totalBonos)}
                                            </span>
                                        </div>

                                        <div className="flex justify-between gap-4 text-sm">
                                            <span className="text-gray-500">
                                                Pagado por otros medios
                                            </span>

                                            <span className="font-medium text-sky-700">
                                                {formatoMoneda(totalOtrosMedios)}
                                            </span>
                                        </div>

                                        <div className="flex justify-between gap-4 text-sm">
                                            <span className="text-gray-500">
                                                Total pagado
                                            </span>

                                            <span className="font-semibold text-emerald-700">
                                                {formatoMoneda(detalle.total_pagado)}
                                            </span>
                                        </div>

                                        <div className="flex justify-between gap-4 text-sm">
                                            <span className="text-gray-500">
                                                Cambio
                                            </span>

                                            <span className="font-medium text-gray-800">
                                                {formatoMoneda(detalle.cambio)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Seccion>

                            {/* Última actualización */}
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                <IoCalendarOutline size={15} />

                                <span>
                                    Última actualización:{' '}
                                    {formatoFecha(detalle.fecha_actualizacion)}
                                </span>
                            </div>
                        </div>
                    )}
                </DialogContent>

                <DialogActions
                    sx={{
                        px: 3,
                        py: 2,
                        borderTop: '1px solid #e5e7eb',
                        backgroundColor: '#fff'
                    }}
                >
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                    >
                        Cerrar detalle
                    </button>
                </DialogActions>
            </Dialog>
        </>
    );
};
