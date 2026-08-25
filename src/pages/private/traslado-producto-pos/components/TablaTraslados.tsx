import React from "react";
import DataTable from "react-data-table-component";

import { ITrasladoProducto } from "../../../../interfaces/pos.interface";
import { formatDate } from "../../../../utils/formatDate";

interface Props {
    traslados: ITrasladoProducto[];
}

export const TablaTraslados = ({ traslados }: Props) => {

    const columns = [
        {
            name: "#",
            selector: (row: ITrasladoProducto) => row.id_log,
            sortable: true,
            width: "80px",
        },
        {
            name: "Código",
            selector: (row: ITrasladoProducto) => row.codigo,
            sortable: true,
            wrap: true,
        },
        {
            name: "Producto",
            selector: (row: ITrasladoProducto) => row.producto,
            sortable: true,
            wrap: true,
            grow: 2,
        },
        {
            name: "Cantidad",
            selector: (row: ITrasladoProducto) => row.stock,
            sortable: true,
            center: true,
        },
        {
            name: "Bodega salida",
            selector: (row: ITrasladoProducto) =>
                row.bodega_salida,
            sortable: true,
            wrap: true,
        },
        {
            name: "Bodega entrada",
            selector: (row: ITrasladoProducto) =>
                row.bodega_entrada,
            sortable: true,
            wrap: true,
        },
        {
            name: "Usuario",
            selector: (row: ITrasladoProducto) =>
                row.usuario,
            sortable: true,
            wrap: true,
        },
        {
            name: "Fecha",
            selector: (row: ITrasladoProducto) =>
                formatDate(row.fecha),
            sortable: true,
            wrap: true,
        },
    ];

    return (
        <div className="mt-5 overflow-hidden rounded-lg bg-white shadow-sm">
            <DataTable
                columns={columns}
                data={traslados}
                pagination
                highlightOnHover
                responsive
                noDataComponent={
                    <div className="py-8 text-center text-slate-500">
                        No se encontraron traslados
                    </div>
                }
            />
        </div>
    );
};