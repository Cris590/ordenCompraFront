import React, { useCallback, useEffect, useState } from 'react'
import DataTable, { type TableColumn } from 'react-data-table-component';
import { IEditarProductoModeloCrm, IFiltroProductosCRM, IProductoResumenCrm } from '../../../../../interfaces/ecommerce.interface';
import { obtenerProductosCrm } from '../../../../../actions/ecommerce/ecommerce';
import Swal from 'sweetalert2';
import LoadingSpinnerScreen from '../../../../../components/loadingSpinnerScreen/LoadingSpinnerScreen';
import { currencyFormat } from '../../../../../utils/currencyFormat';
import { Button, IconButton, Tooltip } from '@mui/material';
import { IoGrid } from 'react-icons/io5';
import { DialogEditarProducto } from './DialogEditarProducto';
import { useProductoEdicionStore } from '../../../../../store/ecommerce/producto-edicion';

interface Props {
    filtros: IFiltroProductosCRM;
}

const productoDefecto:IEditarProductoModeloCrm = {
   id_categoria:0,
    categoria:'',
    id_sub_categoria:0,
    sub_categoria:'',
    codigo_auxiliar:'',
    codigo_modelo:'',
    descripcion:'',
    precio_compra:0,
    precio_venta:0,
    lote:'',
    total_colores:0,
    total_tallas:0,
    tallas:[],
    colores:[],
    cod_tallaje:0,
    activo:1,
    nuevo_producto:true
}

export const TableProductos = ({ filtros }: Props) => {
    const [data, setData] = useState<IProductoResumenCrm[]>([]);
    const [loading, setLoading] = useState(false);
    const [totalRows, setTotal] = useState(0);
    const [perPage, setPerPage] = useState(10);
    // const [selectedProducto, setSelectedProduct] = useState<IProductoResumenCrm>(productoDefecto);
    const [openDialogEditarProducto, setOpenDialogEditarProducto] = useState(false);

    /** Store producto */
    const resetProducto = useProductoEdicionStore((state) => state.resetProducto)
    const setProductoSeleccionado = useProductoEdicionStore((state) => state.setEdicionProducto)

    const cargarProductos = () => {
        load(1, perPage, filtros);
    }

    const columns: TableColumn<IProductoResumenCrm>[] = [
        { name: 'Categoria', selector: r => r.categoria, wrap: true },
        { name: 'Sub Categoria', selector: r => r.sub_categoria, wrap: true },
        { name: 'Lote', selector: r => r.lote, wrap: true },
        { name: 'Código', selector: r => r.codigo_auxiliar, wrap: true },
        { name: 'Descripción', selector: r => r.descripcion, wrap: true },
        { name: 'Precio Compra', selector: r => currencyFormat(r.precio_compra) },
        { name: 'Precio Venta', selector: r => currencyFormat(r.precio_venta) },
        { name: 'Total Colores', selector: r => r.total_colores },
        { name: 'Total Tallas', selector: r => r.total_tallas },
        {
            name: 'Acciones X', cell: row =>
            (<>
                <Tooltip title="Editar Producto">
                    <IconButton
                        color="primary"
                        onClick={() =>handleEditarProducto(row)}
                    >
                        <IoGrid />
                    </IconButton>
                </Tooltip>
            </>)

        }
    ];

    const load = useCallback(async (page: number, pp: number, filtros: IFiltroProductosCRM) => {
        setLoading(true);

        const response = await obtenerProductosCrm(page, pp, filtros)
        if (response?.error) {
            setData([]);
            setTotal(0);
            Swal.fire(response.msg)
        } else {
            setData(response?.data || []);
            setTotal(response?.pagination.total || 0);

        }
        setLoading(false);
    }, []);

    useEffect(() => {
        setProductoSeleccionado(productoDefecto)
        load(1, perPage, filtros);
    }, [filtros, perPage, load]);

    const handleEditarProducto=(producto:IProductoResumenCrm)=>{

        setProductoSeleccionado({...producto, nuevo_producto:false})
        setOpenDialogEditarProducto(true)
    }

     const handleCloseEditarProducto = async (actualizar:boolean) => {

        resetProducto();
        setOpenDialogEditarProducto(false);

        if(actualizar){
            cargarProductos();
        }
    }

    const handleCrearProducto =()=>{
        resetProducto()
        setOpenDialogEditarProducto(true)
    }
    return (
        <>
            <Button onClick={handleCrearProducto} variant='contained'>Crear Producto</Button>
            <DataTable
                columns={columns}
                data={data}
                progressPending={loading}
                pagination
                paginationServer
                paginationTotalRows={totalRows}
                onChangePage={page => load(page, perPage, filtros)}
                onChangeRowsPerPage={(pp) => {
                    setPerPage(pp);
                }}
                highlightOnHover
            />

            <DialogEditarProducto 
                open={openDialogEditarProducto}
                onClose={(actualizar)=>handleCloseEditarProducto(actualizar)}
                // producto={selectedProducto}
            />
            <LoadingSpinnerScreen open={loading} />
        </>

    );
}
