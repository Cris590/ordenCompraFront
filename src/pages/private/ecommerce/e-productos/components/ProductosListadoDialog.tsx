import React, { useEffect, useState } from 'react';
import {
    Box,
    Dialog,
    DialogTitle,
    IconButton,
    Typography,
} from '@mui/material';

import DataTable, { TableColumn } from 'react-data-table-component';
import { IoCloseOutline } from 'react-icons/io5';
import { IProductoListadoCrm } from '../../../../../interfaces/pos.interface';
import { ColorCircle } from '../../../../../components/product/color-circle/ColorCircle';
import { useFilteredData } from '../../../../../hooks/useFilteredData';
import { obtenerProductosListadoCrm } from '../../../../../actions/ecommerce/ecommerce';
import LoadingSpinnerScreen from '../../../../../components/loadingSpinnerScreen/LoadingSpinnerScreen';


interface ProductosListadoDialogProps {
    open: boolean;
    codigoModelo: string;
    onClose: () => void;
}

const ProductosListadoDialog: React.FC<ProductosListadoDialogProps> = ({
        open,
        codigoModelo,
        onClose,
    }) => {
   
    
    const [productos, setProductos] = useState<IProductoListadoCrm[]>([]);
    const { search, setSearch, filteredData } = useFilteredData(productos);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      cargarListado()
    }, [codigoModelo])
    

    const columns: TableColumn<IProductoListadoCrm>[] = [
        {
            name: 'Código',
            selector: row => row.codigo,
            sortable: true,
            width: '150px',
        },
        {
            name: 'Descripción',
            selector: row => row.descripcion,
            sortable: true,
            wrap: true,
            minWidth: '250px',
        },
        {
            name: 'Color',
            cell: row => (
            row.color_rgb ? (
                <ColorCircle
                    color={row.color_rgb}
                    description={`${row.codigo_color} - ${row.nombre_color}`}
                    size="2"
                />
                ) : (
                    <span className="text-gray-400">Sin color</span>
                )
            ),
            width: '170px',
        },
        {
            name: 'Talla',
            selector: row => row.talla,
            sortable: true,
            width: '100px',
            center: true,
        },
        {
            name: 'Categoría',
            selector: row => row.categoria,
            sortable: true,
            width: '150px',
        },
        {
            name: 'Subcategoría',
            selector: row => row.sub_categoria,
            sortable: true,
            wrap: true,
            width: '180px',
        },
    ];

     const cargarListado = async () => {
            try {
                setLoading(true)
                const response = await obtenerProductosListadoCrm(codigoModelo);
                setLoading(false)
                setProductos(response?.productos || []);
    
            } catch (error) {
                console.error(error);
            }
        };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="lg"
        >
            <DialogTitle
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    pb: 1,
                }}
            >
                <Box>
                    <Typography variant="h6" fontWeight={600}>
                        Productos
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Modelo: {codigoModelo}
                    </Typography>
                </Box>

                <IconButton onClick={onClose}>
                    <IoCloseOutline />
                </IconButton>
            </DialogTitle>

            <Box sx={{ px: 2, pb: 2 }}>
                <div className="mb-4">
              <input
                type="text"
                placeholder="Buscar..."
                className="border rounded p-2"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

            </div>
                <DataTable
                    columns={columns}
                    data={filteredData}
                    pagination
                    highlightOnHover
                    responsive
                    striped
                    persistTableHead
                    noDataComponent="No hay productos para este modelo"
                />
            </Box>
            <LoadingSpinnerScreen open={loading} />
        </Dialog>
    );
};

export default ProductosListadoDialog;