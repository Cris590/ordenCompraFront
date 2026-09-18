import React, { useEffect, useState } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography
} from '@mui/material';
import {
    IoArrowForwardOutline,
    IoCloseOutline
} from 'react-icons/io5';

import {
    IAsignacionTienda,
    IEstadoPermitidoPedidoEcommerce,
    IInventarioDisponibleProducto,
    INuevoSeguimientoPedidoEcommerce,
    IPedidoEcommerceGestion
} from '../../../../../interfaces/ecommerce.interface';

import {
    crearSeguimientoPedidoEcommerce,
    obtenerInventarioDisponiblePedidoEcommerce
} from '../../../../../actions/ecommerce/ecommerce';
import Swal from 'sweetalert2';

interface Props {
    open: boolean;
    onClose: () => void;
    pedido: IPedidoEcommerceGestion;
    estadosPermitidos: IEstadoPermitidoPedidoEcommerce[];
    onActualizado: () => void;
}



const ESTADO_REQUIERE_INVENTARIO = 4;

export const ModalCambioEstadoPedido = ({
    open,
    onClose,
    pedido,
    estadosPermitidos,
    onActualizado
}: Props) => {

    const [codEstado, setCodEstado] = useState<number | ''>('');
    const [descripcion, setDescripcion] = useState('');
    const [loading, setLoading] = useState(false);

    const [ inventariosDisponibles, setInventariosDisponibles ] = useState<IInventarioDisponibleProducto[]>([]);

    const [loadingInventario, setLoadingInventario] = useState(false);

    const [asignacionesInventario, setAsignacionesInventario] = useState<Record<string, IAsignacionTienda[]>>({});

    const requiereInventario = codEstado === ESTADO_REQUIERE_INVENTARIO;

    useEffect(() => {

        if (!open) {
            return;
        }

        setCodEstado('');
        setDescripcion('');
        setInventariosDisponibles([]);
        setAsignacionesInventario({});

    }, [open]);

    useEffect(() => {

        if (!open) {
            return;
        }

        const cargarInventario = async () => {

            try {

                setLoadingInventario(true);
                const response = await obtenerInventarioDisponiblePedidoEcommerce(pedido.cod_ecommerce_pedido);
                setInventariosDisponibles(response!.inventario || []);

            } catch (error) {

                console.error(
                    'Error obteniendo inventario disponible:',
                    error
                );

                setInventariosDisponibles([]);

            } finally {

                setLoadingInventario(false);

            }
        };

        cargarInventario();

    }, [
        open,
        pedido.cod_ecommerce_pedido
    ]);

    const handleSeleccionarCantidad = (
        codigoProducto: string,
        idTienda: number,
        cantidad: number
    ) => {

        setAsignacionesInventario((prev) => {

            const asignaciones =
                prev[codigoProducto] || [];

            const existe =
                asignaciones.some(
                    (item) =>
                        item.id_tienda === idTienda
                );

            if (cantidad <= 0) {

                return {
                    ...prev,
                    [codigoProducto]:
                        asignaciones.filter(
                            (item) =>
                                item.id_tienda !== idTienda
                        )
                };
            }

            if (existe) {

                return {
                    ...prev,
                    [codigoProducto]:
                        asignaciones.map(
                            (item) =>
                                item.id_tienda === idTienda
                                    ? {
                                          ...item,
                                          cantidad
                                      }
                                    : item
                        )
                };
            }

            return {
                ...prev,
                [codigoProducto]: [
                    ...asignaciones,
                    {
                        id_tienda: idTienda,
                        cantidad
                    }
                ]
            };

        });
    };

    const obtenerCantidadAsignada = (
        codigoProducto: string,
        idTienda: number
    ) => {

        const asignacion =
            asignacionesInventario[codigoProducto]?.find(
                (item) =>
                    item.id_tienda === idTienda
            );

        return asignacion?.cantidad || 0;
    };

    const obtenerTotalAsignado = (
        codigoProducto: string
    ) => {

        return (
            asignacionesInventario[codigoProducto]
                ?.reduce(
                    (total, item) =>
                        total + item.cantidad,
                    0
                ) || 0
        );
    };

    const validarInventarioProducto = (
        producto: IInventarioDisponibleProducto
    ) => {

        const totalAsignado =
            obtenerTotalAsignado(
                producto.codigo_producto
            );

        if (
            totalAsignado !==
            producto.cantidad_pedida
        ) {
            return false;
        }

        return producto.tiendas.every(
            (tienda) => {

                const cantidad =
                    obtenerCantidadAsignada(
                        producto.codigo_producto,
                        tienda.id_tienda
                    );

                return (
                    cantidad <=
                    tienda.cantidad_disponible
                );
            }
        );
    };

    const inventarioValido = inventariosDisponibles.length > 0 && inventariosDisponibles.every((producto) =>validarInventarioProducto(producto));

    const formularioValido =
        !!codEstado &&
        !!descripcion.trim() &&
        (!requiereInventario ||
            (
                !loadingInventario &&
                inventarioValido
            ));

    const handleGuardar = async () => {

        if (!formularioValido) {
            return;
        }

        try {

            setLoading(true);

            const data:INuevoSeguimientoPedidoEcommerce = {
                cod_ecommerce_pedido: pedido.cod_ecommerce_pedido,
                cod_ecommerce_estado_pedido:codEstado,
                descripcion:descripcion.trim(),
                inventario: requiereInventario
                    ? inventariosDisponibles.map(
                          (producto) => ({
                              id_producto:producto.id_producto,
                              asignaciones: (asignacionesInventario[producto.codigo_producto] || [])
                                            .filter((asignacion) => asignacion.cantidad > 0 )
                          })
                      )
                    : []
            };

            const seguimiento  = await crearSeguimientoPedidoEcommerce(data);
            Swal.fire(seguimiento!.msg)

            onClose();
            onActualizado();

        } catch (error) {

            console.error(
                'Error cambiando estado:',
                error
            );

        } finally {

            setLoading(false);

        }
    };

    return (
        <Dialog
            open={open}
            onClose={
                loading
                    ? undefined
                    : onClose
            }
            fullWidth
            maxWidth={
                requiereInventario
                    ? 'lg'
                    : 'sm'
            }
        >

            <DialogTitle>

                <div className="flex items-center justify-between">

                    <div>

                        <Typography
                            variant="h6"
                            fontWeight={700}
                        >
                            Cambiar estado del pedido
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            {pedido.numero_pedido}
                        </Typography>

                    </div>

                    <Button
                        onClick={onClose}
                        disabled={loading}
                        color="inherit"
                        sx={{
                            minWidth: 40,
                            width: 40,
                            height: 40,
                            padding: 0
                        }}
                    >
                        <IoCloseOutline
                            size={24}
                        />
                    </Button>

                </div>

            </DialogTitle>

            <DialogContent>

                <div className="flex flex-col gap-5 pt-2">

                    {/* Estado actual */}

                    <div>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                            display="block"
                        >
                            Estado actual
                        </Typography>

                        <Typography
                            variant="body1"
                            fontWeight={600}
                        >
                            {
                                pedido
                                    .descripcion_estado_pedido
                            }
                        </Typography>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            {
                                pedido
                                    .codigo_estado_pedido
                            }
                        </Typography>

                    </div>

                    {/* Nuevo estado */}

                    <FormControl fullWidth>

                        <InputLabel id="estado-pedido-label">
                            Nuevo estado
                        </InputLabel>

                        <Select
                            labelId="estado-pedido-label"
                            value={codEstado}
                            label="Nuevo estado"
                            disabled={loading}
                            onChange={(event) => {

                                const nuevoEstado =
                                    event.target.value === ''
                                        ? ''
                                        : Number(
                                              event.target.value
                                          );

                                setCodEstado(
                                    nuevoEstado
                                );

                                setAsignacionesInventario(
                                    {}
                                );

                            }}
                        >

                            {estadosPermitidos.map(
                                (estado) => (

                                    <MenuItem
                                        key={
                                            estado
                                                .cod_ecommerce_estado_pedido
                                        }
                                        value={
                                            estado
                                                .cod_ecommerce_estado_pedido
                                        }
                                    >

                                        <div className="flex flex-col">

                                            <Typography
                                                variant="body2"
                                                fontWeight={600}
                                            >
                                                {
                                                    estado.descripcion
                                                }
                                            </Typography>

                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                            >
                                                {
                                                    estado.codigo
                                                }
                                            </Typography>

                                        </div>

                                    </MenuItem>

                                )
                            )}

                        </Select>

                    </FormControl>

                    {/* Inventario */}

                    {requiereInventario && (

                        <div className="border rounded-xl p-4 bg-gray-50">

                            <div className="mb-4">

                                <Typography
                                    variant="subtitle1"
                                    fontWeight={700}
                                >
                                    Asignación de inventario
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Distribuya la cantidad solicitada
                                    entre las tiendas disponibles.
                                </Typography>

                            </div>

                            {loadingInventario ? (

                                <div className="py-8 text-center">

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        Consultando inventario
                                        disponible...
                                    </Typography>

                                </div>

                            ) : inventariosDisponibles.length === 0 ? (

                                <div className="py-8 text-center">

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        No hay inventario disponible
                                        para los productos del pedido.
                                    </Typography>

                                </div>

                            ) : (

                                <div className="flex flex-col gap-5">

                                    {inventariosDisponibles.map(
                                        (producto) => {

                                            const totalAsignado = obtenerTotalAsignado(producto.codigo_producto);
                                            const cantidadRestante =producto.cantidad_pedida - totalAsignado;
                                            const productoValido =validarInventarioProducto(producto);

                                            return (

                                                <div
                                                    key={producto.codigo_producto}
                                                    className="bg-white border rounded-lg p-4"
                                                >

                                                    {/* Producto */}

                                                    <div className="mb-4">

                                                        <Typography
                                                            variant="body1"
                                                            fontWeight={700}
                                                        >
                                                            Producto
                                                        </Typography>

                                                        <Typography
                                                            variant="body2"
                                                            color="text.secondary"
                                                        >
                                                            SKU:{' '}
                                                            {producto.codigo_producto} - {producto.descripcion}
                                                        </Typography>

                                                    </div>

                                                    {/* Resumen */}

                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">

                                                        <TextField
                                                            fullWidth
                                                            label="Cantidad del pedido"
                                                            value={producto.cantidad_pedida}
                                                            disabled
                                                        />

                                                        <TextField
                                                            fullWidth
                                                            label="Cantidad asignada"
                                                            value={
                                                                totalAsignado
                                                            }
                                                            disabled
                                                        />

                                                        <TextField
                                                            fullWidth
                                                            label="Cantidad restante"
                                                            value={
                                                                cantidadRestante
                                                            }
                                                            disabled
                                                        />

                                                    </div>

                                                    {/* Tiendas */}

                                                    <div className="flex flex-col gap-3">

                                                        {producto.tiendas.map(
                                                            (tienda) => {

                                                                const cantidadAsignada =obtenerCantidadAsignada(
                                                                        producto.codigo_producto,
                                                                        tienda.id_tienda
                                                                    );

                                                                const stockResultante =tienda.cantidad_disponible - cantidadAsignada;

                                                                return (

                                                                    <div
                                                                        key={tienda.id_tienda}
                                                                        className="border rounded-lg p-3"
                                                                    >

                                                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">

                                                                            {/* Tienda */}

                                                                            <div>

                                                                                <Typography
                                                                                    variant="body2"
                                                                                    fontWeight={600}
                                                                                >
                                                                                    {
                                                                                        tienda.nombre_tienda
                                                                                    }
                                                                                </Typography>

                                                                                <Typography
                                                                                    variant="caption"
                                                                                    color="text.secondary"
                                                                                >
                                                                                    Stock
                                                                                    disponible:{' '}
                                                                                    {
                                                                                        tienda.cantidad_disponible
                                                                                    }
                                                                                </Typography>

                                                                            </div>

                                                                            {/* Stock */}

                                                                            <TextField
                                                                                fullWidth
                                                                                size="small"
                                                                                label="Stock disponible"
                                                                                value={
                                                                                    tienda.cantidad_disponible
                                                                                }
                                                                                disabled
                                                                            />

                                                                            {/* Cantidad a descontar */}

                                                                            <TextField
                                                                                fullWidth
                                                                                size="small"
                                                                                type="number"
                                                                                label="Cantidad a descontar"
                                                                                value={
                                                                                    cantidadAsignada ||
                                                                                    ''
                                                                                }
                                                                                disabled={
                                                                                    loading
                                                                                }
                                                                                inputProps={{
                                                                                    min: 0,
                                                                                    max:
                                                                                        Math.min(
                                                                                            tienda.cantidad_disponible,
                                                                                            producto.cantidad_pedida
                                                                                        )
                                                                                }}
                                                                                onChange={(
                                                                                    event
                                                                                ) => {

                                                                                    let cantidad =
                                                                                        Number(
                                                                                            event
                                                                                                .target
                                                                                                .value
                                                                                        );

                                                                                    if (
                                                                                        cantidad <
                                                                                        0
                                                                                    ) {
                                                                                        cantidad = 0;
                                                                                    }

                                                                                    if (
                                                                                        cantidad >
                                                                                        tienda.cantidad_disponible
                                                                                    ) {
                                                                                        cantidad =
                                                                                            tienda.cantidad_disponible;
                                                                                    }

                                                                                    const otrasAsignaciones =
                                                                                        totalAsignado -
                                                                                        cantidadAsignada;

                                                                                    const maxPermitido =
                                                                                        producto.cantidad_pedida -
                                                                                        otrasAsignaciones;

                                                                                    if (
                                                                                        cantidad >
                                                                                        maxPermitido
                                                                                    ) {
                                                                                        cantidad =
                                                                                            maxPermitido;
                                                                                    }

                                                                                    handleSeleccionarCantidad(
                                                                                        producto.codigo_producto,
                                                                                        tienda.id_tienda,
                                                                                        cantidad
                                                                                    );

                                                                                }}
                                                                            />

                                                                            {/* Stock resultante */}

                                                                            <TextField
                                                                                fullWidth
                                                                                size="small"
                                                                                label="Stock después"
                                                                                value={
                                                                                    stockResultante
                                                                                }
                                                                                disabled
                                                                                helperText="Después del despacho"
                                                                            />

                                                                        </div>

                                                                    </div>

                                                                );
                                                            }
                                                        )}

                                                    </div>

                                                    {/* Estado de asignación */}

                                                    <div className="mt-4">

                                                        <Typography
                                                            variant="body2"
                                                            fontWeight={600}
                                                            color={
                                                                productoValido
                                                                    ? 'success.main'
                                                                    : 'warning.main'
                                                            }
                                                        >
                                                            {productoValido
                                                                ? `Cantidad completa asignada: ${totalAsignado} de ${producto.cantidad_pedida}`
                                                                : `Cantidad asignada: ${totalAsignado} de ${producto.cantidad_pedida}`}
                                                        </Typography>

                                                    </div>

                                                </div>

                                            );
                                        }
                                    )}

                                </div>

                            )}

                        </div>

                    )}

                    {/* Seguimiento */}

                    <TextField
                        fullWidth
                        multiline
                        minRows={4}
                        maxRows={8}
                        label="Descripción del seguimiento"
                        placeholder="Ingrese una descripción para registrar el seguimiento..."
                        value={descripcion}
                        onChange={(event) =>
                            setDescripcion(
                                event.target.value
                            )
                        }
                        disabled={loading}
                    />

                </div>

            </DialogContent>

            <DialogActions className="!px-6 !pb-5">

                <Button
                    variant="outlined"
                    color="inherit"
                    onClick={onClose}
                    disabled={loading}
                >
                    Cancelar
                </Button>

                <Button
                    variant="contained"
                    endIcon={
                        <IoArrowForwardOutline />
                    }
                    onClick={handleGuardar}
                    disabled={
                        loading ||
                        loadingInventario ||
                        !formularioValido
                    }
                >
                    {loading
                        ? 'Guardando...'
                        : 'Cambiar estado'}
                </Button>

            </DialogActions>

        </Dialog>
    );
};
