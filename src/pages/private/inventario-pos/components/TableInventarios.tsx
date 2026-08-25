import React from 'react'
import { IInventarioProducto } from '../../../../interfaces/pos.interface';
import DataTable from 'react-data-table-component';

interface Props {
    inventarios: IInventarioProducto[];
}

export const TableInventarios = ({ inventarios }: Props) => {

    const columns = [
        {
            name: "#",
            selector: (row: IInventarioProducto) => row.id,
            sortable: true,
        },
        {
            name: "Categoria",
            selector: (row: IInventarioProducto) => row.categoria,
            sortable: true,
            wrap: true,
        },
        {
            name: "Sub-categoria",
            selector: (row: IInventarioProducto) => row.sub_categoria,
            sortable: true,
            wrap: true,
        },
        {
            name: "Código producto",
            selector: (row: IInventarioProducto) => row.codigo,
            sortable: true,
            wrap: true,
        },
        {
            name: "Descipción",
            selector: (row: IInventarioProducto) => row.descripcion,
            sortable: true,
            wrap: true,
        },
        {
            name: "Tienda",
            selector: (row: IInventarioProducto) => row.bodega,
            sortable: true,
            wrap: true,
        },
        {
            name: "Cantidad",
            selector: (row: IInventarioProducto) => row.cantidad,
            sortable: true,
            wrap: true,
            cell: (row: IInventarioProducto) => {
                const cantidad = Number(row.cantidad);

                let clases = "";

                if (cantidad > 10) {
                    clases =
                        "bg-emerald-50 text-emerald-700 border border-emerald-200";
                } else if (cantidad >= 3) {
                    clases =
                        "bg-yellow-50 text-yellow-700 border border-yellow-200";
                } else if (cantidad >= 1) {
                    clases =
                        "bg-orange-50 text-orange-700 border border-orange-200";
                } else if (cantidad === 0) {
                    clases =
                        "bg-red-50 text-red-700 border border-red-200";
                } else {
                    clases =
                        "bg-red-100 text-red-800 border-2 border-red-400";
                }

                return (
                    <span
                        className={`
                            inline-flex
                            min-w-[52px]
                            items-center
                            justify-center
                            rounded-full
                            px-3
                            py-1
                            text-sm
                            font-bold
                            ${clases}
                            `}
                    >
                        {cantidad}
                    </span>
                );
            },
        }
    ];
    return (
        <>
            <DataTable
                columns={columns}
                data={inventarios}
                pagination
                highlightOnHover
            />
        </>
    )
}
