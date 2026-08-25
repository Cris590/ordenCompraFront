import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";

import { TrasladoProductosModal } from "./components/TrasladoProductosModal";
import LoadingSpinnerScreen from "../../../components/loadingSpinnerScreen/LoadingSpinnerScreen";
import { FiltroTraslados } from "./components/FiltroTraslados";

import {
    IFiltroTrasladosProductos,
    ITrasladoProducto,
} from "../../../interfaces/pos.interface";

import { obtenerRangoMesActual } from "../../../utils/obtenerRangoMesActual";
import { obtenerHistorialTraslados } from "../../../actions/pos/pos";
import { TablaTraslados } from "./components/TablaTraslados";

export const TrasladoProductoPosPage = () => {
    const rangoMesActual = obtenerRangoMesActual();

    const [openTraslado, setOpenTraslado] = useState(false);
    const [openLoadingSpinner, setOpenLoadingSpinner] = useState(false);

    const [traslados, setTraslados] = useState<ITrasladoProducto[]>([]);

    const [filtros, setFiltros] =
        useState<IFiltroTrasladosProductos>({
            fecha_inicial: rangoMesActual.fechaInicial,
            fecha_final: rangoMesActual.fechaFinal,
            id_bodega_salida: [],
            id_bodega_entrada: [],
            codigo_producto: "",
        });

    useEffect(() => {
        obtenerTraslados(filtros);
    }, []);

    const handleFiltrar = (nuevosFiltros: IFiltroTrasladosProductos) => {
        setFiltros(nuevosFiltros);
        obtenerTraslados(nuevosFiltros);
    };

    const obtenerTraslados = async (filtrosConsulta: IFiltroTrasladosProductos) => {
        setOpenLoadingSpinner(true);

        try {
            const res = await obtenerHistorialTraslados(
                filtrosConsulta
            );

            setTraslados(res?.traslados || []);
        } catch (error) {
            console.error(error);
        } finally {
            setOpenLoadingSpinner(false);
        }
    };

    const handleCloseModalTraslado = (actualizar?:boolean)=>{
      if(actualizar){
        obtenerTraslados(filtros);
      }
      setOpenTraslado(false)
    }

    return (
        <>
            <LoadingSpinnerScreen open={openLoadingSpinner} />

            <Box className="min-h-screen bg-slate-100 p-4 md:p-6">
                <div className="mx-auto max-w-[1600px]">

                    {/* HEADER */}
                    <div className="mb-5">
                        <Typography
                            variant="h5"
                            fontWeight={700}
                            className="text-slate-800"
                        >
                            Traslado de productos
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Gestión de movimientos entre bodegas
                        </Typography>
                    </div>

                    {/* FILTRO */}
                    <FiltroTraslados
                        filtros={filtros}
                        onFiltrar={handleFiltrar}
                        onNuevoTraslado={() =>
                            setOpenTraslado(true)
                        }
                    />
                    <TablaTraslados traslados={traslados} />

                    {/* AQUÍ IRÁ LA TABLA */}
                    <div className="mt-5">
                        {/* <TableTraslados traslados={traslados} /> */}
                    </div>

                    {/* MODAL NUEVO TRASLADO */}
                    <TrasladoProductosModal
                        open={openTraslado}
                        onClose={handleCloseModalTraslado}
                    />
                </div>
            </Box>
        </>
    );
};