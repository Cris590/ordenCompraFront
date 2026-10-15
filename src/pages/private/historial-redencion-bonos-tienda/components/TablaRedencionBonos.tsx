import React, { useState } from "react";
import { Button, Tooltip } from "@mui/material";
import DataTable from "react-data-table-component";

import {
    IoEyeOutline,
} from "react-icons/io5";

import { formatDate } from "../../../../utils/formatDate";
import { IBonoRedimidosResumen } from "../../../../interfaces/redencion_bonos.interface";
import { ModalDetalleBonoRedimido } from "./ModalDetalleBonoRedimido";


interface Props {
    bonosRedimidos: IBonoRedimidosResumen[];
}

const formatMoney = (value: number) =>
    new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0,
    }).format(value);

export const TablaRedencionBonos = ({ bonosRedimidos }: Props) => {

    const [bonoSeleccionado, setBonoSeleccionado] = useState<IBonoRedimidosResumen | null>(null);

    const [modalDetalleOpen, setModalDetalleOpen] = useState(false);


    const handleVerBonoRedimido = async (bono: IBonoRedimidosResumen) => {
        setBonoSeleccionado(bono);
        setModalDetalleOpen(true);
    };

    const handleCerrarDetalle = () => {
        setModalDetalleOpen(false);
        setBonoSeleccionado(null);
    };


    const columns = [
        {
            name: "#",
            selector: (row: IBonoRedimidosResumen) => row.cod_redencion_bono_tienda,
            sortable: true,
        },
        {
            name: "Documento Cliente",
            selector: (row: IBonoRedimidosResumen) => row.documento_cliente,
            sortable: true,
            wrap: true,
        },
        {
            name: "Nombre Cliente",
            selector: (row: IBonoRedimidosResumen) => row.nombre_cliente,
            sortable: true,
            wrap: true,
        },
        {
            name: "Documento Vendedor",
            selector: (row: IBonoRedimidosResumen) => row.documento_usuario,
            sortable: true,
            wrap: true,
        },
        {
            name: "Nombre Vendedor",
            selector: (row: IBonoRedimidosResumen) => row.nombre_usuario,
            sortable: true,
            wrap: true,
        },
        {
            name: "Tienda",
            selector: (row: IBonoRedimidosResumen) => (row.tienda),
            sortable: true,
            wrap: true,
        },
        {
            name: "No. Productos",
            selector: (row: IBonoRedimidosResumen) => (row.total_productos),
            sortable: true,
            wrap: true,
        },
        {
            name: "No. bonos",
            selector: (row: IBonoRedimidosResumen) => (row.total_bonos),
            sortable: true,
            wrap: true,
        },
        {
            name: "Total Pagado",
            selector: (row: IBonoRedimidosResumen) => formatMoney(row.total_pagado),
            sortable: true,
            wrap: true,
        },
        {
            name: "Fecha creación",
            selector: (row: IBonoRedimidosResumen) => formatDate(row.fecha_creacion),
            sortable: true,
            wrap: true,
        },
        {
            name: "Acciones",
            cell: (row: IBonoRedimidosResumen) => (
                <div className="flex items-center">


                    {/* VER */}
                    <Tooltip title="Ver bono">
                        <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleVerBonoRedimido(row)}
                            sx={{
                                minWidth: 38,
                                width: 38,
                                height: 36,
                                borderRadius: 0,
                                backgroundColor: "#f59e0b",
                                "&:hover": {
                                    backgroundColor: "#d97706",
                                },
                            }}
                        >
                            <IoEyeOutline size={19} />
                        </Button>
                    </Tooltip>

                </div>
            ),
        },
    ];

    return (
        <>
            <DataTable
                columns={columns}
                data={bonosRedimidos}
                pagination
                highlightOnHover
            />

            <ModalDetalleBonoRedimido
                open={modalDetalleOpen}
                codRedencionBono={bonoSeleccionado?.cod_redencion_bono_tienda}
                onClose={handleCerrarDetalle}
            />

        </>
    );
};