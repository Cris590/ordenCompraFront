import React, { useCallback, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import DataTable, { type TableColumn } from 'react-data-table-component';


import { IconButton, Tooltip, Chip, CardContent, Card } from '@mui/material';
import { IoEye } from 'react-icons/io5';
import { obtenerListadoPedidosEcommerce } from '../../../../actions/ecommerce/ecommerce';
import { currencyFormat } from '../../../../utils/currencyFormat';
import LoadingSpinnerScreen from '../../../../components/loadingSpinnerScreen/LoadingSpinnerScreen';
import { FiltroBusquedaPedidosEcommerce, IPedidoEcommerceListado } from '../../../../interfaces/ecommerce.interface';
import { useNavigate } from 'react-router-dom';

interface Props {
    filtros: FiltroBusquedaPedidosEcommerce;
}

export const TablePedidos = ({ filtros }: Props) => {

    const navigate = useNavigate()
    const [data, setData] = useState<IPedidoEcommerceListado[]>([]);
    const [loading, setLoading] = useState(false);
    const [totalRows, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);

    const getEstadoColor = (codigo: string): 'default' | 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info' => {

        switch (codigo) {

            case 'RECIBIDO':
                return 'info';

            case 'VALIDANDO':
                return 'warning';

            case 'CONFIRMADO':
                return 'primary';

            case 'PREPARANDO':
                return 'secondary';

            case 'ENVIANDO':
                return 'info';

            case 'ENTREGADO':
                return 'success';

            case 'CANCELADO':
                return 'error';

            case 'PAGO_FALLIDO':
                return 'error';

            case 'DEVUELTO':
                return 'warning';

            default:
                return 'default';
        }
    };

    useEffect(() => {
        cargarPedidos(page, perPage, filtros)
    }, [page, perPage, filtros]);
    
    
    const cargarPedidos = async  (page: number,pp: number,filtros: FiltroBusquedaPedidosEcommerce) => {

        setLoading(true);
        const response = await obtenerListadoPedidosEcommerce(page, pp, filtros);

        if (response?.error) {

            setData([]);
            setTotal(0);

            Swal.fire(response.msg);

        } else {

            setData(response?.data || [])
            setTotal(response?.pagination.total || 0);

        }

        setLoading(false);

    };

    const columns: TableColumn<IPedidoEcommerceListado>[] = [

        {
            name: 'Pedido',
            selector: row => row.numero_pedido,
            wrap: true
        },

        {
            name: 'Cliente',
            selector: row => row.nombre_cliente,
            wrap: true
        },

        {
            name: 'Documento',
            selector: row => row.documento_cliente,
            wrap: true
        },

        {
            name: 'Teléfono',
            selector: row => row.telefono_cliente,
            wrap: true
        },

        {
            name: 'Ciudad',
            selector: row => row.ciudad_envio,
            wrap: true
        },
        {
            name: 'Estado',
            cell: row => (
                <Chip
                    label={row.descripcion_estado_pedido}
                    color={getEstadoColor(row.codigo_estado_pedido)}
                    size="small"
                    variant="outlined"
                    sx={{
                        minWidth: 140,
                        whiteSpace: 'nowrap',
                        '& .MuiChip-label': {
                            overflow: 'visible'
                        }
                    }}
                />
            ),
            minWidth: '160px'
        },
        {
            name: 'Total',
            selector: row => currencyFormat(row.total)
        },
        {
            name: 'Último seguimiento',
            selector: row =>
                row.descripcion_ultimo_seguimiento || '',
            wrap: true
        },

        {
            name: 'Acciones',
            cell: row => (
                <Tooltip title="Gestionar pedido" arrow>
                    <IconButton
                        color="primary"
                        onClick={() => handleGestionarPedido(row)}
                    >
                        <IoEye />
                    </IconButton>
                </Tooltip>
            )
        }

    ];

    const handleGestionarPedido = (
        pedido: IPedidoEcommerceListado
    ) => {

        // Luego:
        navigate(`/gestionar_pedido/${pedido.cod_ecommerce_pedido}`);
    };

    return (
        <>
            <Card
                elevation={0}
                sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    marginRight: 6
                }}
            >
                <CardContent sx={{ p: 0 }}>
                    <DataTable
                        columns={columns}
                        data={data}
                        progressPending={loading}
                        pagination
                        paginationServer
                        paginationTotalRows={totalRows}
                        onChangePage={newPage =>setPage(newPage)}
                        onChangeRowsPerPage={(pp) => {
                            setPerPage(pp);
                            setPage(1);
                        }}
                        highlightOnHover
                    />
                </CardContent>
            </Card>

            <LoadingSpinnerScreen open={loading} />
        </>
    );
};