import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
} from "@mui/material";

import Swal from "sweetalert2";
import { IFiltroLogInventarios, IMovimientoInventario } from "../../../interfaces/pos.interface";
import { FiltroLogInventarios } from "./components/FiltroLogInventarios";
import { obtenerMovimientosInventarios } from "../../../actions/pos/pos";
import LoadingSpinnerScreen from "../../../components/loadingSpinnerScreen/LoadingSpinnerScreen";
import { TableLogInventarios } from "./components/TableLogInventarios";
import { obtenerRangoMesActual } from "../../../utils/obtenerRangoMesActual";



const LogInventariosPage = () => {

    const [movimientos, setMovimientos] = useState<IMovimientoInventario[]>([]);
    const rangoMesActual = obtenerRangoMesActual();
    const [openLoadingSpinner, setOpenLoadingSpinner] =
        useState(false);

    const [filtros, setFiltros] =
        useState<IFiltroLogInventarios>({
            id_tienda: [],
            fecha_inicial: rangoMesActual.fechaInicial,
            fecha_final: rangoMesActual.fechaFinal,
        });

    /* ============================================================
     * CARGAR MOVIMIENTOS
     * ============================================================ */

    const cargarMovimientos = async (
        filtrosConsulta: IFiltroLogInventarios
    ) => {

        try {

            setOpenLoadingSpinner(true);

            const res = await obtenerMovimientosInventarios(filtrosConsulta);

            if (res?.error) {

                Swal.fire({
                    ...res.msg,
                });

                setMovimientos([]);

                return;
            }

            setMovimientos(
                res?.movimientos || []
            );

        } catch (error) {

            console.error(error);

            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No fue posible obtener los movimientos de inventario.",
            });

            setMovimientos([]);

        } finally {

            setOpenLoadingSpinner(false);

        }

    };

    /* ============================================================
     * CARGA INICIAL
     * ============================================================ */

    useEffect(() => {

        cargarMovimientos(filtros);

    }, []);

    /* ============================================================
     * FILTRAR
     * ============================================================ */

    const handleFiltrar = ( nuevosFiltros: IFiltroLogInventarios ) => {

        setFiltros(nuevosFiltros);

        cargarMovimientos(nuevosFiltros);

    };

    return (
        <>

            <LoadingSpinnerScreen open={openLoadingSpinner}/>

            <Box className="min-h-full bg-slate-50 m-5 p-5">

                {/* ================================================= */}
                {/* HEADER */}
                {/* ================================================= */}

                <Box
                    className="border-b border-slate-200 bg-white px-5 py-4"
                >

                    <Typography
                        variant="h6"
                        className="font-semibold text-slate-700"
                    >
                        Movimientos de inventario
                    </Typography>

                    <Typography
                        variant="body2"
                        className="mt-1 text-slate-500"
                    >
                        Consulta y seguimiento de los movimientos
                        realizados en el inventario.
                    </Typography>

                </Box>

                {/* ================================================= */}
                {/* FILTROS */}
                {/* ================================================= */}

                <Box className="bg-white">

                    <FiltroLogInventarios
                        filtros={filtros}
                        onFiltrar={handleFiltrar}
                    />

                </Box>

                {/* ================================================= */}
                {/* TABLA */}
                {/* ================================================= */}

                <Box className="p-5">

                    <Box className="mb-3 flex items-center justify-between">

                        <Box>

                            <Typography
                                variant="subtitle1"
                                className="font-semibold text-slate-700"
                            >
                                Historial de movimientos
                            </Typography>

                            <Typography
                                variant="body2"
                                className="text-slate-500"
                            >
                                {movimientos.length}{" "}
                                {movimientos.length === 1
                                    ? "movimiento encontrado"
                                    : "movimientos encontrados"
                                }
                            </Typography>

                        </Box>

                    </Box>

                    <TableLogInventarios movimientos={movimientos}/>

                </Box>

            </Box>

        </>
    );
};

export default LogInventariosPage;