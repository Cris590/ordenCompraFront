import React, { useEffect, useState } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    IconButton,
    InputLabel,
    ListItemText,
    MenuItem,
    Select,
    TextField,
    Tooltip,
} from "@mui/material";

import {
    IoAddOutline,
    IoCloseOutline,
    IoTrashOutline,
} from "react-icons/io5";

import Swal from "sweetalert2";

import {
    obtenerProductoInventarioPorCodigoPos,
    obtenerTiendasPosUsuario,
} from "../../../../actions/pos/pos";

import { IProductoTraslado } from "../../../../interfaces/pos.interface";

interface TrasladoProductosModalProps {
    open: boolean;
    onClose: () => void;
}

const productoInicial = (): IProductoTraslado => ({
    id: 0,
    codigo: "",
    descripcion: "",
    cantidadDisponible: 0,
    cantidadTransferir: 0,
});

export const TrasladoProductosModal = ({
    open,
    onClose,
}: TrasladoProductosModalProps) => {

    const [bodegaSalida, setBodegaSalida] = useState<number | null>(null);
    const [bodegaEntrada, setBodegaEntrada] = useState<number | null>(null);

    const [tiendas, setTiendas] = useState<
        { id: number; nombre: string }[]
    >([]);

    const [tiendaVendedor, setTiendaVendedor] = useState(0);

    const [productos, setProductos] = useState<IProductoTraslado[]>([
        productoInicial(),
    ]);

    const [buscandoProducto, setBuscandoProducto] = useState(false);

    // ============================================================
    // TIENDAS
    // ============================================================

    useEffect(() => {
        obtenerTiendas();
    }, []);

    const obtenerTiendas = async () => {
        try {
            const res = await obtenerTiendasPosUsuario();

            if (res?.error) {
                Swal.fire(res.msg);
                return;
            }

            setTiendas(res?.bodegas || []);

            if (res?.idTiendaObligatorio) {
                setTiendaVendedor(res.idTiendaObligatorio);
                setBodegaSalida(res.idTiendaObligatorio);
            }

        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Comuniquese con el administrador",
            });
        }
    };

    // ============================================================
    // BUSCAR PRODUCTO
    // ============================================================

    const buscarProducto = async (index: number,codigo: string) => {
        const codigoLimpio = codigo.replace(/\D/g, "");

        if (codigoLimpio.length !== 14) {
            return;
        }

        if (!bodegaSalida) {
            Swal.fire({
                icon: "warning",
                text: "Debes seleccionar la bodega de salida.",
            });
            return;
        }

        try {
            setBuscandoProducto(true);

            const res = await obtenerProductoInventarioPorCodigoPos(
                codigoLimpio,
                Number(bodegaSalida)
            );

            if (res?.error || !res?.producto) {
                Swal.fire({
                    icon: "warning",
                    title: "Producto no encontrado",
                    text: `No se encontró el producto con código ${codigoLimpio}`,
                });

                setProductos((actuales) =>
                    actuales.map((producto, i) =>
                        i === index
                            ? productoInicial()
                            : producto
                    )
                );

                return;
            }

            const producto = res.producto;

            // ========================================================
            // VALIDAR PRODUCTO DUPLICADO
            // ========================================================

            const productoExiste = productos.some(
                (item, i) =>
                    i !== index &&
                    item.id === producto.id
            );

            if (productoExiste) {
                Swal.fire({
                    icon: "warning",
                    title: "Producto ya agregado",
                    text: `El producto ${producto.codigo} ya se encuentra en el traslado.`,
                });

                // Eliminar la fila donde se escaneó el duplicado
                setProductos((actuales) => {
                    const nuevasFilas = actuales.filter(
                        (_, i) => i !== index
                    );

                    return nuevasFilas.length > 0
                        ? nuevasFilas
                        : [productoInicial()];
                });

                return;
            }

            // ========================================================
            // AGREGAR PRODUCTO
            // ========================================================

            // Producto válido y no repetido
            setProductos((actuales) =>
                actuales.map((item, i) =>
                    i === index
                        ? {
                            ...item,
                            id: producto.id,
                            codigo: producto.codigo,
                            descripcion: producto.descripcion,
                            cantidadDisponible: Number(
                                producto.cantidadDisponible
                            ),
                            cantidadTransferir: 0,
                        }
                        : item
                )
            );

        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No fue posible consultar el producto.",
            });
        } finally {
            setBuscandoProducto(false);
        }
    };

    // ============================================================
    // PRODUCTOS
    // ============================================================

    const agregarProducto = () => {

        const ultimoProducto = productos[productos.length - 1];

        if (!ultimoProducto.id) {
            Swal.fire({
                icon: "warning",
                title: "Producto pendiente",
                text: "Primero debes escanear un producto válido.",
            });

            return;
        }

        setProductos((actuales) => [
            ...actuales,
            productoInicial(),
        ]);
    };

    const eliminarProducto = (index: number) => {
        setProductos((actuales) =>
            actuales.filter((_, i) => i !== index)
        );
    };

    // ============================================================
    // CAMBIAR CANTIDAD
    // ============================================================

    const cambiarCantidad = (index: number,cantidad: number) => {

        setProductos((actuales) =>
            actuales.map((producto, i) =>
                i === index
                    ? {
                        ...producto,
                        cantidadTransferir: cantidad,
                    }
                    : producto
            )
        );
    };

    // ============================================================
    // VALIDAR
    // ============================================================

    const validar = () => {

        if (!bodegaSalida) {
            Swal.fire({
                icon: "warning",
                text: "Debes seleccionar la bodega de salida.",
            });
            return false;
        }

        if (!bodegaEntrada) {
            Swal.fire({
                icon: "warning",
                text: "Debes seleccionar la bodega de entrada.",
            });
            return false;
        }

        if (bodegaSalida === bodegaEntrada) {
            Swal.fire({
                icon: "warning",
                text: "La bodega de salida y entrada deben ser diferentes.",
            });
            return false;
        }

        for (const producto of productos) {

            if (!producto.id) {
                Swal.fire({
                    icon: "warning",
                    text: "Todos los productos deben ser válidos.",
                });
                return false;
            }

            if (producto.cantidadTransferir <= 0) {
                Swal.fire({
                    icon: "warning",
                    text: `Indica una cantidad válida para ${producto.codigo}.`,
                });
                return false;
            }

            if (
                producto.cantidadTransferir >
                producto.cantidadDisponible
            ) {
                Swal.fire({
                    icon: "warning",
                    text: `La cantidad a transferir no puede superar el stock disponible de ${producto.codigo}.`,
                });
                return false;
            }
        }

        return true;
    };

    // ============================================================
    // TRANSFERIR
    // ============================================================

    const handleTransferir = () => {

        if (!validar()) {
            return;
        }

        console.log({
            bodegaSalida,
            bodegaEntrada,
            productos,
        });
    };

    // ============================================================
    // CERRAR
    // ============================================================

    const handleClose = () => {

        setBodegaSalida(null);
        setBodegaEntrada(null);
        setProductos([productoInicial()]);

        onClose();
    };



    // ============================================================
    // RENDER
    // ============================================================

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="lg"
        >

            <DialogTitle className="flex items-center justify-between">
                <span className="font-semibold">
                    Traslado de productos
                </span>

                <IconButton
                    onClick={handleClose}
                    size="small"
                >
                    <IoCloseOutline size={22} />
                </IconButton>
            </DialogTitle>

            <DialogContent>

                {/* BODEGAS */}

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-6 mt-3">

                    <FormControl fullWidth>
                        <InputLabel>
                            Bodega salida
                        </InputLabel>

                        <Select
                            value={bodegaSalida ?? ""}
                            label="Bodega salida"
                            disabled={tiendaVendedor !== 0}
                            onChange={(e) =>
                                setBodegaSalida(
                                    e.target.value
                                        ? Number(e.target.value)
                                        : null
                                )
                            }
                        >
                            {tiendas.map((tienda) => (
                                <MenuItem
                                    key={tienda.id}
                                    value={tienda.id}
                                >
                                    {tienda.nombre}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth>
                        <InputLabel>
                            Bodega entrada
                        </InputLabel>

                        <Select
                            value={bodegaEntrada ?? ""}
                            label="Bodega entrada"
                            onChange={(e) =>
                                setBodegaEntrada(
                                    e.target.value
                                        ? Number(e.target.value)
                                        : null
                                )
                            }
                        >
                            {tiendas
                                .filter((tienda) =>tienda.id !== bodegaSalida)
                                .map((tienda) => (
                                    <MenuItem
                                        key={tienda.id}
                                        value={tienda.id}
                                    >
                                        {tienda.nombre}
                                    </MenuItem>
                                ))}
                        </Select>
                    </FormControl>

                </div>

                {/* PRODUCTOS */}

                <div className="space-y-3">

                    {productos.map((producto, index) => (

                        <div
                            key={index}
                            className="grid grid-cols-1 gap-3 items-center md:grid-cols-[1.2fr_2fr_1fr_1fr_1fr_auto]"
                        >

                            {/* CÓDIGO */}

                            <TextField
                                fullWidth
                                label="Código producto"
                                size="small"
                                value={producto.codigo}
                                disabled={!bodegaSalida ||buscandoProducto }
                                onChange={(e) => {
                                    const codigo = e.target.value;
                                    setProductos((actuales) =>
                                        actuales.map((item, i) =>
                                            i === index
                                                ? {
                                                    ...item,
                                                    codigo,
                                                }
                                                : item
                                        )
                                    );

                                    // Scanner completó 14 caracteres
                                    if (codigo.replace(/\D/g, "").length === 14) {
                                        buscarProducto(index,codigo);
                                    }
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        buscarProducto(index,producto.codigo
                                        );
                                    }
                                }}
                                placeholder="Escanee el código..."
                            />

                            {/* DESCRIPCIÓN */}

                            <TextField
                                fullWidth
                                label="Descripción"
                                size="small"
                                value={producto.descripcion}
                                disabled
                            />

                            {/* DISPONIBLE */}

                            <TextField
                                fullWidth
                                label="Disponible"
                                size="small"
                                value={producto.cantidadDisponible}
                                disabled
                            />

                            {/* TRANSFERIR */}

                            <TextField
                                fullWidth
                                label="Transferir"
                                size="small"
                                type="number"
                                value={
                                    producto.cantidadTransferir === 0
                                        ? ""
                                        : producto.cantidadTransferir
                                }
                                disabled={!producto.id}
                                onChange={(e) =>
                                    cambiarCantidad(
                                        index,
                                        Number(e.target.value)
                                    )
                                }
                                inputProps={{
                                    min: 1,
                                    max: producto.cantidadDisponible,
                                }}
                            />

                            {/* NUEVO INVENTARIO */}

                            <TextField
                                fullWidth
                                label="Nuevo inventario"
                                size="small"
                                value={
                                    producto.cantidadDisponible -
                                    producto.cantidadTransferir
                                }
                                disabled
                            />

                            {/* ELIMINAR */}

                            {productos.length > 1 && (
                                <Tooltip title="Eliminar producto">
                                    <IconButton
                                        color="error"
                                        onClick={() =>
                                            eliminarProducto(index)
                                        }
                                    >
                                        <IoTrashOutline size={20} />
                                    </IconButton>
                                </Tooltip>
                            )}

                        </div>
                    ))}

                </div>

                {/* AGREGAR */}

                <div className="mt-4 flex justify-end">

                    <Tooltip title="Agregar producto">

                        <IconButton
                            color="primary"
                            onClick={agregarProducto}
                            sx={{
                                border: "1px solid",
                            }}
                        >
                            <IoAddOutline size={24} />
                        </IconButton>

                    </Tooltip>

                </div>

            </DialogContent>

            <DialogActions className="px-6 pb-4">

                <Button
                    variant="outlined"
                    onClick={handleClose}
                >
                    Cancelar
                </Button>

                <Button
                    variant="contained"
                    onClick={handleTransferir}
                >
                    Transferir
                </Button>

            </DialogActions>

        </Dialog>
    );
};