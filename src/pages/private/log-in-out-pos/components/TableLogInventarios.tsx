import React, { useState } from "react";
import {
    Box,
    Chip,
    Collapse,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";

import {
    IoChevronDownOutline,
    IoChevronUpOutline,
    IoCubeOutline,
    IoArrowDownOutline,
    IoArrowUpOutline,
} from "react-icons/io5";
import { IMovimientoInventario } from "../../../../interfaces/pos.interface";


interface Props {
    movimientos: IMovimientoInventario[];
}

export const TableLogInventarios = ({ movimientos }: Props) => {

    const [filasAbiertas, setFilasAbiertas] = useState<number[]>([]);

    const toggleFila = (index: number) => {

        setFilasAbiertas((actual) =>
            actual.includes(index)
                ? actual.filter((item) => item !== index)
                : [...actual, index]
        );

    };

    const esEntrada = (tipo: string) => {
        return tipo.toLowerCase().includes("entrada");
    };

    const formatearFecha = (fecha: string) => {

        if (!fecha) return "-";

        const date = new Date(fecha);

        if (isNaN(date.getTime())) {
            return fecha;
        }

        return new Intl.DateTimeFormat("es-CO", {
            dateStyle: "short",
            timeStyle: "short",
        }).format(date);
    };

    if (!movimientos.length) {

        return (
            <Box className="flex flex-col items-center justify-center py-16">

                <IoCubeOutline
                    size={48}
                    className="mb-3 text-slate-300"
                />

                <Typography
                    variant="h6"
                    className="text-slate-500"
                >
                    No hay movimientos de inventario
                </Typography>

                <Typography
                    variant="body2"
                    className="mt-1 text-slate-400"
                >
                    No se encontraron movimientos para los filtros seleccionados.
                </Typography>

            </Box>
        );

    }

    return (
        <TableContainer
            component={Paper}
            elevation={0}
            className="border border-slate-200 rounded-lg"
        >

            <Table>

                <TableHead>

                    <TableRow
                        className="bg-slate-50"
                    >

                        <TableCell
                            width={50}
                            className="font-bold text-slate-600"
                        >
                            #
                        </TableCell>

                        <TableCell
                            className="font-bold text-slate-600"
                        >
                            Tipo operación
                        </TableCell>

                        <TableCell
                            className="font-bold text-slate-600"
                        >
                            Bodega
                        </TableCell>

                        <TableCell
                            className="font-bold text-slate-600"
                        >
                            Usuario
                        </TableCell>

                        <TableCell
                            className="font-bold text-slate-600"
                        >
                            Productos
                        </TableCell>

                        <TableCell
                            className="font-bold text-slate-600"
                        >
                            Comentario
                        </TableCell>

                        <TableCell
                            className="font-bold text-slate-600"
                        >
                            Fecha
                        </TableCell>

                        <TableCell width={60} />

                    </TableRow>

                </TableHead>

                <TableBody>

                    {movimientos.map((movimiento, index) => {

                        const abierta = filasAbiertas.includes(index);
                        const entrada = esEntrada(movimiento.tipo_operacion);

                        return (
                            <React.Fragment key={index}>

                                {/* ================================================= */}
                                {/* FILA PRINCIPAL */}
                                {/* ================================================= */}

                                <TableRow
                                    hover
                                    className="transition-colors"
                                >

                                    <TableCell>
                                        <Typography
                                            variant="body2"
                                            className="font-medium text-slate-500"
                                        >
                                            {index + 1}
                                        </Typography>
                                    </TableCell>

                                    {/* TIPO OPERACIÓN */}

                                    <TableCell>

                                        <Chip
                                            icon={
                                                entrada
                                                    ? <IoArrowDownOutline size={16} />
                                                    : <IoArrowUpOutline size={16} />
                                            }
                                            label={movimiento.tipo_operacion}
                                            size="small"
                                            color={entrada ? "success" : "error"}
                                            variant="outlined"
                                        />

                                    </TableCell>

                                    {/* BODEGA */}

                                    <TableCell>

                                        <Typography
                                            variant="body2"
                                            className="font-medium text-slate-700"
                                        >
                                            {movimiento.bodega}
                                        </Typography>

                                    </TableCell>

                                    {/* USUARIO */}

                                    <TableCell>

                                        <Typography
                                            variant="body2"
                                            className="text-slate-600"
                                        >
                                            {movimiento.usuario}
                                        </Typography>

                                    </TableCell>

                                    {/* PRODUCTOS */}

                                    <TableCell>

                                        <Box
                                            className="flex items-center gap-2"
                                        >

                                            <Box
                                                className="flex items-center justify-center rounded-full bg-slate-100 px-2 py-1"
                                            >

                                                <IoCubeOutline
                                                    size={15}
                                                    className="mr-1 text-slate-500"
                                                />

                                                <Typography
                                                    variant="caption"
                                                    className="font-semibold text-slate-600"
                                                >
                                                    {movimiento.productos.length}
                                                </Typography>

                                            </Box>

                                            <Typography
                                                variant="body2"
                                                className="text-slate-600"
                                            >
                                                {movimiento.productos.length === 1
                                                    ? "producto"
                                                    : "productos"
                                                }
                                            </Typography>

                                        </Box>

                                    </TableCell>

                                    {/* COMENTARIO */}

                                    <TableCell>

                                        <Typography
                                            variant="body2"
                                            className="max-w-[250px] break-words whitespace-normal text-slate-600"
                                            title={movimiento.comentario}
                                        >
                                            {movimiento.comentario || "-"}
                                        </Typography>

                                    </TableCell>

                                    {/* FECHA */}

                                    <TableCell>

                                        <Typography
                                            variant="body2"
                                            className="whitespace-nowrap text-slate-600"
                                        >
                                            {formatearFecha(movimiento.fecha)}
                                        </Typography>

                                    </TableCell>

                                    {/* EXPANDIR */}

                                    <TableCell>

                                        <IconButton
                                            size="small"
                                            onClick={() => toggleFila(index)}
                                        >

                                            {abierta
                                                ? <IoChevronUpOutline size={18} />
                                                : <IoChevronDownOutline size={18} />
                                            }

                                        </IconButton>

                                    </TableCell>

                                </TableRow>

                                {/* ================================================= */}
                                {/* DETALLE DE PRODUCTOS */}
                                {/* ================================================= */}

                                <TableRow>

                                    <TableCell
                                        colSpan={8}
                                        className="!p-0"
                                    >

                                        <Collapse
                                            in={abierta}
                                            timeout="auto"
                                            unmountOnExit
                                        >

                                            <Box
                                                className="bg-slate-50 px-8 py-4"
                                            >

                                                <Typography
                                                    variant="subtitle2"
                                                    className="mb-3 font-bold text-slate-700"
                                                >
                                                    Detalle de productos
                                                </Typography>

                                                <Box
                                                    className="overflow-hidden rounded-md border border-slate-200 bg-white"
                                                >

                                                    <Table
                                                        size="small"
                                                    >

                                                        <TableHead>

                                                            <TableRow
                                                                className="bg-slate-50"
                                                            >

                                                                <TableCell>
                                                                    <strong>Código</strong>
                                                                </TableCell>

                                                                <TableCell>
                                                                    <strong>Descripción</strong>
                                                                </TableCell>

                                                                <TableCell align="center">
                                                                    <strong>Cantidad</strong>
                                                                </TableCell>

                                                                <TableCell align="center">
                                                                    <strong>Stock actual</strong>
                                                                </TableCell>

                                                            </TableRow>

                                                        </TableHead>

                                                        <TableBody>

                                                            {movimiento.productos.map(
                                                                (producto) => (
                                                                    <TableRow
                                                                        key={producto.id}
                                                                        hover
                                                                    >

                                                                        <TableCell>

                                                                            <Typography
                                                                                variant="body2"
                                                                                className="font-mono text-xs text-slate-600"
                                                                            >
                                                                                {producto.codigo}
                                                                            </Typography>

                                                                        </TableCell>

                                                                        <TableCell>

                                                                            <Typography
                                                                                variant="body2"
                                                                                className="text-slate-700"
                                                                            >
                                                                                {producto.descripcion}
                                                                            </Typography>

                                                                        </TableCell>

                                                                        <TableCell align="center">

                                                                            <Chip
                                                                                label={producto.cantidad}
                                                                                size="small"
                                                                                color={
                                                                                    entrada
                                                                                        ? "success"
                                                                                        : "error"
                                                                                }
                                                                                variant="outlined"
                                                                            />

                                                                        </TableCell>

                                                                        <TableCell align="center">

                                                                            <Typography
                                                                                variant="body2"
                                                                                className="font-semibold text-slate-700"
                                                                            >
                                                                                {producto.stock_actual}
                                                                            </Typography>

                                                                        </TableCell>

                                                                    </TableRow>
                                                                )
                                                            )}

                                                        </TableBody>

                                                    </Table>

                                                </Box>

                                            </Box>

                                        </Collapse>

                                    </TableCell>

                                </TableRow>

                            </React.Fragment>
                        );

                    })}

                </TableBody>

            </Table>

        </TableContainer>
    );
};