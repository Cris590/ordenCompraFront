import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import LoadingSpinnerScreen from '../../../components/loadingSpinnerScreen/LoadingSpinnerScreen';
import { Title } from '../../../components/title/Title';
import Swal from 'sweetalert2';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useFilteredData } from '../../../hooks/useFilteredData';
import { IBonoRedimido } from '../../../interfaces/entidad_bonos.interface';
import { consultarReporteBonosRedimidos } from '../../../actions/entidad_bono/entidad_bono';
import { useUserStore } from '../../../store/user/user';
import { formatDate } from '../../../utils/formatDate';
import { currencyFormat } from '../../../utils/currencyFormat';
import { IconButton, Tooltip } from '@mui/material';
import { IoDownloadOutline } from 'react-icons/io5';

export const ReporteDotacionBonosPage = () => {

    const [usuarios, setUsuarios] = useState<IBonoRedimido[]>([]);
    const [openLoadingSpinner, setOpenLoadingSpinner] = useState(false)
    const { search, setSearch, filteredData } = useFilteredData(usuarios);
    const session = useUserStore((state) => state.user)

    const columns = [
        {
            name: 'Codigo',
            selector: (row: IBonoRedimido) => row.codigo,
            sortable: true
        },
        {
            name: 'Nombre',
            selector: (row: IBonoRedimido) => row.nombre,
            sortable: true
        },
        {
            name: 'Cedula',
            selector: (row: IBonoRedimido) => row.cedula,
            sortable: true
        },
        {
            name: 'Detalle productos',
            selector: (row: IBonoRedimido) => row.descripcion,
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
            selector: (row: IBonoRedimido) => row.tienda
        },
        {
            name: 'Nombre vendedor',
            selector: (row: IBonoRedimido) => row.nombre_vendedor
        },
        {
            name: 'Cédula vendedor',
            selector: (row: IBonoRedimido) => row.cedula_vendedor
        },
        {
            name: 'Comentario de cierre',
            selector: (row: IBonoRedimido) => row.comentario_cierre
        },
        {
            name: 'Fecha redención',
            selector: (row: IBonoRedimido) => formatDate(row.fecha_redimido)
        }
    ];

    useEffect(() => {
        obtenerReporte()
    }, [])



    const obtenerReporte = async () => {

        setOpenLoadingSpinner(true)
        let response = await consultarReporteBonosRedimidos(session?.cod_usuario || 0)
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
            <div className='m-6'>


                <div className="container mx-auto p-4">
                    <Title title="reporte redencion de bonos" />
                    <div className="mb-4">
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
