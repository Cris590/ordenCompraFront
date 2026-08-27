import React, { useEffect, useRef, useState } from "react";
import {
    Alert,
    Box,
    Button,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    SelectChangeEvent,
    Snackbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";

import { IoRefreshOutline, IoTrashOutline } from "react-icons/io5";

import { IBodegaPos, IProductoMovimiento, AccionInventario, IProductoTraslado } from "../../../interfaces/pos.interface";


// Cambiar por tus acciones reales

import { ModalComentarioInventario } from "./components/ModalComentarioInventario";
import { obtenerProductoInventarioPorCodigoPos, obtenerTiendasPosUsuario } from "../../../actions/pos/pos";
import Swal from "sweetalert2";

export const EntradaSalidaInventarioPage = () => {

    const [bodegas, setBodegas] = useState<IBodegaPos[]>([]);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "warning" as "success" | "error" | "warning" | "info",
    });

    const [idBodega, setIdBodega] = useState<number | "">("");
    const [accion, setAccion] = useState<AccionInventario | "">("");

    const [configuracionConfirmada, setConfiguracionConfirmada] =
        useState(false);

    const [codigo, setCodigo] = useState("");
    const [buscandoProducto, setBuscandoProducto] = useState(false);

    const [productos, setProductos] = useState<IProductoTraslado[]>([]);

    const [openComentario, setOpenComentario] = useState(false);
    const [guardando, setGuardando] = useState(false);

    const scannerRef = useRef<HTMLInputElement>(null);

    // ---------------------------------------------------
    // BODEGAS
    // ---------------------------------------------------

    useEffect(() => {
        cargarBodegas();
    }, []);

    const cargarBodegas = async () => {
        try {
            const response = await obtenerTiendasPosUsuario();

            setBodegas(response?.bodegas || []);
        } catch (error) {
            console.error(error);
        }
    };

    const mostrarSnackbar = (message: string, severity: "success" | "error" | "warning" | "info" = "warning") => {
        setSnackbar({
            open: true,
            message,
            severity,
        });
    };

    // ---------------------------------------------------
    // SELECCIONES
    // ---------------------------------------------------

    const handleBodega = (event: SelectChangeEvent<number>) => {
        setIdBodega(event.target.value as number);
    };

    const handleAccion = (
        event: SelectChangeEvent<AccionInventario>
    ) => {
        setAccion(event.target.value as AccionInventario);
    };

    // ---------------------------------------------------
    // CONFIRMAR CONFIGURACIÓN
    // ---------------------------------------------------

    const confirmarConfiguracion = async () => {

        if (!idBodega || !accion) {
            return;
        }

        const bodega = bodegas.find(
            (item) => item.id === idBodega
        );

        const nombreAccion = accion === "in" ? "Entrada de inventario" : "Salida de inventario";

        const resultado = await Swal.fire({
            title: "¿Desea confirmar los parámetros seleccionados?",
            html: `
                <div style="text-align: left;">
                    <p><strong>Acción:</strong> ${nombreAccion}</p>
                    <p><strong>Bodega:</strong> ${bodega?.nombre ?? ""}</p>
                </div>
            `,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Sí, proceder",
            cancelButtonText: "Cancelar",
            reverseButtons: true,
        });

        if (!resultado.isConfirmed) {
            return;
        }

        setConfiguracionConfirmada(true);

        setTimeout(() => {
            scannerRef.current?.focus();
        }, 100);
    };

    // ---------------------------------------------------
    // ESCÁNER
    // ---------------------------------------------------

    const handleCodigoChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {

        const valor = event.target.value
            .replace(/\D/g, "")
            .slice(0, 14);

        setCodigo(valor);

        if (valor.length === 14) {
            procesarCodigoEscaneado(valor);
        }
    };

    const procesarCodigoEscaneado = async (
        codigoEscaneado: string
    ) => {

        if (codigoEscaneado.length !== 14) {
            return;
        }

        if (!idBodega) {
            return;
        }

        setBuscandoProducto(true);

        try {

            const response = await obtenerProductoInventarioPorCodigoPos(codigoEscaneado, idBodega);

            if (!response?.producto) {
                mostrarSnackbar(
                    "No se encontró el producto en la bodega seleccionada.",
                    "warning"
                );

                setCodigo("");
                scannerRef.current?.focus();

                return;
            }
            const producto = response.producto
            setProductos((actuales) => {

                const existe = actuales.find((item) => item.id === producto.id);

                if (existe) {

                    return actuales.map((item) => {

                        if (item.id !== producto.id) {
                            return item;
                        }

                        const nuevaCantidad = item.cantidadTransferir + 1;

                        return {
                            id: producto.id,
                            codigo: producto.codigo,
                            descripcion: producto.descripcion,
                            cantidadDisponible: producto.cantidadDisponible,
                            cantidadTransferir: nuevaCantidad
                        };
                    });
                }

                return [
                    ...actuales,
                    {
                        id: producto.id,
                        codigo: producto.codigo,
                        descripcion: producto.descripcion,
                        cantidadDisponible: producto.cantidadDisponible,
                        cantidadTransferir: 0
                    },
                ];
            });

        } catch (error) {

            console.error(error);

            await Swal.fire({
                icon: "error",
                title: "Error",
                text: "Ocurrió un error al consultar el producto.",
                confirmButtonText: "Aceptar",
            });

        } finally {

            setBuscandoProducto(false);
            setCodigo("");

            setTimeout(() => {
                scannerRef.current?.focus();
            }, 100);
        }
    };

    // ---------------------------------------------------
    // CANTIDAD
    // ---------------------------------------------------

    const cambiarCantidad = (
        idProducto: number,
        valor: number
    ) => {

        if (valor < 0) { return }

        setProductos((actuales) =>
            actuales.map((producto) => {

                if (producto.id !== idProducto) {
                    return producto;
                }

                return {
                    ...producto,
                    cantidadTransferir: valor,
                };
            })
        );
    };

    // ---------------------------------------------------
    // NUEVO STOCK
    // ---------------------------------------------------

    const calcularNuevoStock = (
        producto: IProductoTraslado
    ) => {

        if (accion === "in") {
            return producto.cantidadDisponible + producto.cantidadTransferir;
        }

        return producto.cantidadDisponible - producto.cantidadTransferir;
    };

    // ---------------------------------------------------
    // REINICIAR
    // ---------------------------------------------------

    const reiniciar = () => {

        setIdBodega("");
        setAccion("");
        setConfiguracionConfirmada(false);

        setCodigo("");
        setProductos([]);

        setTimeout(() => {
            scannerRef.current?.focus();
        }, 100);
    };

    // ---------------------------------------------------
    // PROCEDER A GUARDAR
    // ---------------------------------------------------

    const procederGuardar = () => {

        if (productos.length === 0) {
            mostrarSnackbar(
                "Debe agregar al menos un producto.",
                "warning"
            );

            return;
        }

        const hayStockNegativo = productos.some((producto) =>calcularNuevoStock(producto) < 0);

        if (hayStockNegativo) {

            window.alert(
                "La cantidad de salida no puede ser mayor al stock disponible."
            );

            return;
        }

        setOpenComentario(true);
    };

    // ---------------------------------------------------
    // GUARDAR
    // ---------------------------------------------------

    const guardarMovimiento = async (comentario: string) => {

        if (!idBodega || !accion) {
            return;
        }

        setGuardando(true);

        try {

            const payload = {
                id_bodega: idBodega,
                accion,
                comentario,
                productos: productos.map((producto) => ({
                    id_producto: producto.id,
                    codigo: producto.codigo,
                    stock_actual: producto.cantidadDisponible,
                    cantidad: producto.cantidadTransferir,
                    nuevo_stock: calcularNuevoStock(producto),
                })),
            };

            console.log('--- Payload a guardar ----', payload)
            return
            // await crearMovimientoInventario(payload);

            setOpenComentario(false);

            window.alert(
                "Movimiento de inventario realizado correctamente."
            );

            reiniciar();

        } catch (error) {

            console.error(error);

            window.alert(
                "No fue posible realizar el movimiento de inventario."
            );

        } finally {

            setGuardando(false);
        }
    };

    const bodegaSeleccionada = bodegas.find(
        (item) => item.id === idBodega
    );

    const eliminarProducto = (idProducto: number) => {
        setProductos((actuales) =>
            actuales.filter((producto) => producto.id !== idProducto)
        );

        setTimeout(() => {
            scannerRef.current?.focus();
        }, 100);
    };

    return (
        <>
            <Box sx={{ p: 2 }}>

                <Typography
                    variant="h6"
                    sx={{ mb: 2 }}
                >
                    Entrada / Salida de inventarios
                </Typography>

                {/* CONFIGURACIÓN */}

                <Paper
                    sx={{
                        p: 3,
                        mb: 2,
                    }}
                >

                    <Box
                        sx={{
                            display: "flex",
                            gap: 2,
                            alignItems: "flex-end",
                            flexWrap: "wrap",
                        }}
                    >

                        {/* BODEGA */}

                        <FormControl
                            size="small"
                            sx={{ minWidth: 280 }}
                        >
                            <InputLabel>
                                Seleccionar bodega
                            </InputLabel>

                            <Select
                                value={idBodega}
                                label="Seleccionar bodega"
                                onChange={handleBodega}
                                disabled={configuracionConfirmada}
                            >
                                {bodegas.map((bodega) => (
                                    <MenuItem
                                        key={bodega.id}
                                        value={bodega.id}
                                    >
                                        {bodega.nombre}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* ACCIÓN */}

                        <FormControl
                            size="small"
                            sx={{ minWidth: 280 }}
                        >
                            <InputLabel>
                                Seleccionar acción
                            </InputLabel>

                            <Select
                                value={accion}
                                label="Seleccionar acción"
                                onChange={handleAccion}
                                disabled={configuracionConfirmada}
                            >

                                <MenuItem value="entrada">
                                    Entrada de inventario
                                </MenuItem>

                                <MenuItem value="salida">
                                    Salida de inventario
                                </MenuItem>

                            </Select>
                        </FormControl>

                        {/* BOTÓN INICIAL */}

                        {!configuracionConfirmada && (

                            <Button
                                variant="contained"
                                onClick={confirmarConfiguracion}
                                disabled={!idBodega || !accion}
                            >
                                Proceder
                            </Button>

                        )}

                        {/* REINICIAR */}

                        {configuracionConfirmada && (

                            <Button
                                variant="outlined"
                                color="warning"
                                startIcon={<IoRefreshOutline />}
                                onClick={reiniciar}
                            >
                                Reiniciar
                            </Button>

                        )}

                    </Box>

                    {configuracionConfirmada && (

                        <Box
                            sx={{
                                mt: 2,
                                p: 1.5,
                                backgroundColor: "#f5f5f5",
                                borderRadius: 1,
                            }}
                        >
                            <Typography variant="body2">
                                <strong>Bodega:</strong>{" "}
                                {bodegaSeleccionada?.nombre}
                            </Typography>

                            <Typography variant="body2">
                                <strong>Acción:</strong>{" "}
                                {accion === "in"
                                    ? "Entrada de inventario"
                                    : "Salida de inventario"}
                            </Typography>
                        </Box>

                    )}

                </Paper>

                {/* MOVIMIENTO */}

                {configuracionConfirmada && (

                    <Paper sx={{ p: 6, m: 3 }}>

                        {/* ESCÁNER */}

                        <Box
                            sx={{
                                display: "flex",
                                gap: 2,
                                alignItems: "flex-end",
                                mb: 3,
                            }}
                        >

                            <TextField
                                inputRef={scannerRef}
                                label="Código del producto"
                                value={codigo}
                                onChange={handleCodigoChange}
                                size="small"
                                disabled={buscandoProducto}
                                autoFocus
                                inputProps={{
                                    maxLength: 14,
                                }}
                                sx={{
                                    width: 350,
                                }}
                            />

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Escanee el producto
                            </Typography>

                        </Box>

                        {/* TABLA */}

                        <TableContainer className="pe-6">

                            <Table>

                                <TableHead>

                                    <TableRow>

                                        <TableCell>
                                            Código
                                        </TableCell>

                                        <TableCell>
                                            Descripción
                                        </TableCell>

                                        <TableCell align="right">
                                            Stock actual
                                        </TableCell>

                                        <TableCell align="right">
                                            Cantidad a modificar
                                        </TableCell>

                                        <TableCell align="right">
                                            Nuevo stock
                                        </TableCell>

                                        <TableCell align="center">
                                            Acciones
                                        </TableCell>

                                    </TableRow>

                                </TableHead>

                                <TableBody>

                                    {productos.map((producto) => {

                                        const nuevoStock =
                                            calcularNuevoStock(producto);

                                        return (

                                            <TableRow key={producto.id}>

                                                <TableCell>
                                                    {producto.codigo}
                                                </TableCell>

                                                <TableCell>
                                                    {producto.descripcion}
                                                </TableCell>

                                                <TableCell align="right">
                                                    {producto.cantidadDisponible}
                                                </TableCell>

                                                <TableCell align="right">

                                                    <TextField
                                                        type="number"
                                                        size="small"
                                                        value={ producto.cantidadTransferir === 0 ? "" : producto.cantidadTransferir}
                                                        onChange={(e) => cambiarCantidad(producto.id || 0, Number(e.target.value))}
                                                        inputProps={{ min: 0 }}
                                                        sx={{ width: 110 }}
                                                    />

                                                </TableCell>

                                                <TableCell
                                                    align="right"
                                                    sx={{
                                                        fontWeight: "bold",
                                                        color:
                                                            nuevoStock < 0
                                                                ? "error.main"
                                                                : "inherit",
                                                    }}
                                                >
                                                    {nuevoStock}
                                                </TableCell>

                                                <TableCell align="center">
                                                    <Tooltip title="Eliminar producto">
                                                        <IconButton
                                                            color="error"
                                                            size="small"
                                                            onClick={() => eliminarProducto(producto.id || 0)}
                                                        >
                                                            <IoTrashOutline />
                                                        </IconButton>
                                                    </Tooltip>
                                                </TableCell>

                                            </TableRow>

                                        );
                                    })}

                                    {productos.length === 0 && (

                                        <TableRow>

                                            <TableCell
                                                colSpan={5}
                                                align="center"
                                            >
                                                Escanee un producto para
                                                comenzar
                                            </TableCell>

                                        </TableRow>

                                    )}

                                </TableBody>

                            </Table>

                        </TableContainer>

                        {/* PROCEDER */}

                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                                mt: 3,
                            }}
                        >

                            <Button
                                variant="contained"
                                color="success"
                                onClick={procederGuardar}
                                disabled={
                                    productos.length === 0 ||
                                    buscandoProducto
                                }
                            >
                                Proceder
                            </Button>

                        </Box>

                    </Paper>

                )}

                {/* MODAL COMENTARIO */}

                <ModalComentarioInventario
                    open={openComentario}
                    loading={guardando}
                    onClose={() => setOpenComentario(false)}
                    onConfirm={guardarMovimiento}
                />

            </Box>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() =>
                    setSnackbar((prev) => ({
                        ...prev,
                        open: false,
                    }))
                }
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                }}
            >
                <Alert
                    onClose={() =>
                        setSnackbar((prev) => ({
                            ...prev,
                            open: false,
                        }))
                    }
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{ width: "100%" }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>

        </>
    );
};