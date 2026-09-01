
import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import Swal from 'sweetalert2';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import { IconButton, Tooltip } from '@mui/material';
import { IoDownloadOutline } from 'react-icons/io5';
import { IBonoRedimido } from '../../../../../interfaces/entidad_bonos.interface';
import { useFilteredData } from '../../../../../hooks/useFilteredData';
import { currencyFormat } from '../../../../../utils/currencyFormat';
import { formatDate } from '../../../../../utils/formatDate';
import { consultarReporteBonosRedimidosTotal } from '../../../../../actions/entidad_bono/entidad_bono';
import { Title } from '../../../../../components/title/Title';
import LoadingSpinnerScreen from '../../../../../components/loadingSpinnerScreen/LoadingSpinnerScreen';

interface Props {
    codEntidad:number
}
export const ReporteBonosEntregados = ( { codEntidad }: Props ) => {

    const [usuarios, setUsuarios] = useState<IBonoRedimido[]>([]);
    const [openLoadingSpinner, setOpenLoadingSpinner] = useState(false)
    const { search, setSearch, filteredData } = useFilteredData(usuarios);
    const columns = [
        {
            name: 'Estado',
            selector: (row: IBonoRedimido) => row.cedula_vendedor !== 'PENDIENTE',
            sortable: true,
            cell: (row: IBonoRedimido) => (
                <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        (row.cedula_vendedor !== 'PENDIENTE')
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                    }`}
                >
                    {(row.cedula_vendedor !== 'PENDIENTE') ? 'Redimido' : 'Pendiente'}
                </span>
            )
        },
        {
            name: 'Codigo',
            selector: (row: IBonoRedimido) => row.codigo,
            sortable: true
        },
        {
            name: 'Nombre Cliente',
            selector: (row: IBonoRedimido) => row.nombre,
            sortable: true,
            wrap:true
        },
        {
            name: 'Cedula',
            selector: (row: IBonoRedimido) => row.cedula,
            sortable: true
        },
        {
            name: 'Detalle productos',
            selector: (row: IBonoRedimido) => row.descripcion,
            sortable: true,
            wrap:true
        },
        {
            name: 'Entidad',
            selector: (row: IBonoRedimido) => row.entidad,
            sortable: true,
            wrap:true
        },
        {
            name: 'No Contrato',
            selector: (row: IBonoRedimido) => row.no_contrato,
            sortable: true
        },
        {
            name: 'Valor',
            selector: (row: IBonoRedimido) => currencyFormat(+row.valor),
            sortable: true
        },
        {
            name: 'Sexo',
            selector: (row: IBonoRedimido) => (row.sexo === "F") ? "Femenino" : "Masculino"
        },
        {
            name: 'Tienda',
            selector: (row: IBonoRedimido) => row.tienda,
            wrap:true
        },
        {
            name: 'Nombre vendedor',
            selector: (row: IBonoRedimido) => row.nombre_vendedor,
            wrap:true
        },
        {
            name: 'Cédula vendedor',
            selector: (row: IBonoRedimido) => row.cedula_vendedor
        },
        {
            name: 'Comentario de cierre',
            selector: (row: IBonoRedimido) => row.comentario_cierre,
            wrap:true
        },
        {
            name: 'Fecha redención',
            selector: (row: IBonoRedimido) => formatDate(row.fecha_redimido),
            wrap:true
        }
    ];

    useEffect(() => {
     obtenerReporte()
    }, [codEntidad])
    
    const obtenerReporte = async () => {
        setUsuarios([])
        setOpenLoadingSpinner(true)
        let response = await consultarReporteBonosRedimidosTotal(codEntidad)
        setOpenLoadingSpinner(false)
        if (response?.error == 0) {
            setUsuarios(response.usuarios)
        } else if (response?.error == 1) {
            Swal.fire(response.msg)
        }
    }

    const downloadExcelReport = (fileName = "reporte") => {
        // Format the data
        const formattedData = usuarios.map(item => ({
            fecha_redimido: formatDate(item.fecha_redimido), // format date
            comentario_cierre: item.comentario_cierre,
            cedula_vendedor: item.cedula_vendedor,
            nombre_vendedor: item.nombre_vendedor,
            tienda: item.tienda,
            nombre: item.nombre,
            cedula: item.cedula,
            codigo: item.codigo,
            sexo: item.sexo,
            valor: currencyFormat(+item.valor), // format as money
            descripcion: item.descripcion,
        }));

        // Convert JSON → worksheet
        const worksheet = XLSX.utils.json_to_sheet(formattedData);

        // Create workbook and append worksheet
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte");

        // Generate buffer
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

        // Save file
        const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(blob, `${fileName}.xlsx`);
    };

    return (

        <>

            <div className='m-1'>
                
                <div className="container mx-auto p-2">
                    <Title title="reporte redencion de bonos" />
                    <div className="mb-2">
                        <input
                            type="text"
                            placeholder="Buscar..."
                            className="border rounded p-2"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />


                        <Tooltip title="Descargar Reporte" onClick={() => downloadExcelReport("bonos_reporte")}>
                            <IconButton size="large">
                                <IoDownloadOutline />
                            </IconButton>
                        </Tooltip>

                    </div>
                    <DataTable
                        columns={columns}
                        data={filteredData}
                        pagination
                        highlightOnHover
                        noDataComponent='No Hay datos para mostrar'
                    />
                    <LoadingSpinnerScreen open={openLoadingSpinner} />

                </div>
            </div>
        </>
    )
}
