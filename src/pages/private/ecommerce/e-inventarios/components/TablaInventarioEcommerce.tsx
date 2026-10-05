import React, { useState } from 'react';
import { Button, Tooltip } from '@mui/material';
import DataTable from 'react-data-table-component';

import { IoEyeOutline, IoLogoWordpress } from 'react-icons/io5';

import { IInventarioEcommerce } from '../../../../../interfaces/ecommerce.interface';
import LoadingSpinnerScreen from '../../../../../components/loadingSpinnerScreen/LoadingSpinnerScreen';
import { sincronizarInventarioEcommerce } from '../../../../../actions/ecommerce/ecommerce';
import Swal from 'sweetalert2';

interface Props {
    inventarios: IInventarioEcommerce[];
    onVerDetalle: (codigoModelo: string) => void;
}

export const TablaInventarioEcommerce = ({
    inventarios,
    onVerDetalle
}: Props) => {  

    const [ openLoadingSpinner,setOpenLoadingSpinner] = useState(false);
    

    const handleSincronizarProductoEcommerce = async (codigo:string) => {
        setOpenLoadingSpinner(true)
        let response = await sincronizarInventarioEcommerce(codigo)
        setOpenLoadingSpinner(false)
        Swal.fire(response!.msg)
    }

    const columns = [

        {
            name: 'Modelo',
            selector: (row: IInventarioEcommerce) =>
                row.codigo_modelo,
            sortable: true,
            wrap: true,
        },

        {
            name: 'Producto',
            selector: (row: IInventarioEcommerce) =>
                row.descripcion,
            sortable: true,
            wrap: true,
        },

        {
            name: 'Colores',
            selector: (row: IInventarioEcommerce) =>
                row.total_colores,
            sortable: true,
            center: true,
        },

        {
            name: 'Tallas',
            selector: (row: IInventarioEcommerce) =>
                row.total_tallas,
            sortable: true,
            center: true,
        },

        {
            name: 'Stock Ecommerce',
            selector: (row: IInventarioEcommerce) =>
                row.stock_ecommerce,
            sortable: true,
            center: true,

            cell: (row: IInventarioEcommerce) => (
                <span
                    className={
                        row.tiene_stock
                            ? 'font-semibold text-green-600'
                            : 'font-semibold text-red-500'
                    }
                >
                    {row.stock_ecommerce}
                </span>
            ),
        },

        {
            name: 'Acciones',

            cell: (row: IInventarioEcommerce) => (

                <div className="flex items-center">

                    <Tooltip title="Ver inventario">
                        <Button
                            variant="contained"
                            size="small"
                            onClick={() => onVerDetalle(row.codigo_modelo)}
                            sx={{
                                minWidth: 38,
                                width: 38,
                                height: 36,
                                borderRadius: '6px',
                                backgroundColor: '#f8fafc',
                                color: '#475569',
                                border: '1px solid #cbd5e1',
                                boxShadow: 'none',
                                '&:hover': {
                                    backgroundColor: '#e2e8f0',
                                    boxShadow: 'none',
                                },
                            }}
                        >
                            <IoEyeOutline size={20} />
                        </Button>
                    </Tooltip>

                    <Tooltip title="Sincronizar producto con Ecommerce">
                        <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleSincronizarProductoEcommerce(row.codigo_modelo)}
                            sx={{
                                marginInlineStart:1,
                                minWidth: 38,
                                width: 38,
                                height: 36,
                                borderRadius: '6px',
                                backgroundColor: '#50C2E5',
                                color: '#142E36',
                                border: '1px solid #cbd5e1',
                                boxShadow: 'none',
                                '&:hover': {
                                    backgroundColor: '#11649E',
                                    boxShadow: 'none',
                                },
                            }}
                        >
                            <IoLogoWordpress size={20} />
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
                data={inventarios}
                pagination
                highlightOnHover
            />
            <LoadingSpinnerScreen open={openLoadingSpinner}/>
        </>
       

    );
};