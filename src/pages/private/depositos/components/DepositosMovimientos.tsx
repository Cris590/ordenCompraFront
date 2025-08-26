import React, { useContext, useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import { useFilteredData } from '../../../../hooks/useFilteredData';
import { IMovimientoDeposito } from '../../../../interfaces/deposito.interface';
import { IoArrowRedo, IoArrowUndo, IoEye } from 'react-icons/io5';
import { Button, Card, IconButton } from '@mui/material';
import { formatDate } from '../../../../utils/formatDate';
import { Title } from '../../../../components/title/Title';
import { FiltroMovimientos } from './FiltroMovimientos';

export const DepositosMovimientos = () => {

    // const movimientos: IMovimientoDeposito[] = []
    const [movimientos, setMovimientos] = useState<IMovimientoDeposito[]>([])
    const { search, setSearch, filteredData } = useFilteredData(movimientos);


    const handleClickOpenDocument = (url: string) => {
        if (!url) return;
        window.open(url, '_blank', 'noopener,noreferrer');
    }

    const handleClicCrearMovimiento = () => {

    }

    useEffect(() => {
        const movimientos: IMovimientoDeposito[] = Array.from({ length: 20 }, (_, i) => ({
            cod_movimiento: i + 1,
            concepto: `Concepto ${i + 1}`,
            no_factura: `F-${1000 + i}`,
            documento_cliente: `DOC-${2000 + i}`,
            fecha_creacion: new Date().toISOString(),
            entrada_saldo: (i % 2) > 0,
            valor: Math.floor(Math.random() * 100000) + 1000, // Random value between 1000–100999
            url: `https://example.com/movimiento/${i + 1}`
        }));
        setMovimientos(movimientos)
    }, [])



    const columns = [
        {
            name: 'Concepto',
            cell: (row: IMovimientoDeposito) => (
                (!!row.entrada_saldo) ? (
                    <IconButton aria-label="ioban" color='success'>
                        <IoArrowUndo />
                    </IconButton>
                ) : (
                    // <Button variant='contained' size='small' color='error'>Solicitud sin gestionar</Button>
                    <IconButton aria-label="ioban" color='error'>
                        <IoArrowRedo />
                    </IconButton>
                )
            ),
        },
        {
            name: 'Concepto',
            selector: (row: IMovimientoDeposito) => row.concepto,
        },
        {
            name: 'No. Factura',
            selector: (row: IMovimientoDeposito) => row.no_factura,
        },
        {
            name: 'Fecha Gestion',
            cell: (row: IMovimientoDeposito) => (
                <div style={{ whiteSpace: 'normal', overflowWrap: 'break-word', wordBreak: 'break-word' }}>
                    {(!!row.fecha_creacion) ? formatDate(row.fecha_creacion) : ''}
                </div>
            ),
        },
        {
            name: 'Comprobante',
            cell: (row: IMovimientoDeposito) => (
                <>
                    <button
                        onClick={() => handleClickOpenDocument(row.url)}
                        className="bg-blue-500 text-white px-2 py-1 rounded mx-3"
                    >
                        <IoEye />
                    </button>

                </>
            ),
        },
    ];
    return (
        <Card className='container mx-auto p-4'>
            <div >
                <FiltroMovimientos />
                <Title title="Movimientos" />
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Buscar..."
                        className="border rounded p-2 mr-2"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <Button className='ml-4' variant="outlined" onClick={() => handleClicCrearMovimiento()}>
                        Crear Movimiento Entre Entidades
                    </Button>

                </div>
                <DataTable
                    columns={columns}
                    data={filteredData}
                    pagination
                    highlightOnHover
                />
            </div>
        </Card>
    )
}
