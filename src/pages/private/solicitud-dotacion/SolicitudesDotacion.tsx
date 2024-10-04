import React, { useEffect, useState } from 'react'
import { obtenerSolicitudesPendientes } from '../../../actions/solicitud_dotacion/solicitud_dotacion'
import { useFilteredData } from '../../../hooks/useFilteredData';
import { useNavigate } from 'react-router-dom';
import { IOrdenPendiente } from '../../../interfaces/solicitud_dotacion.interface';
import DataTable from 'react-data-table-component';
import LoadingSpinnerScreen from '../../../components/loadingSpinnerScreen/LoadingSpinnerScreen';
import { formatDate } from '../../../utils/formatDate';
import { Title } from '../../../components/title/Title';

export const SolicitudesDotacion = () => {

    const navigate = useNavigate()
    const [openLoadingSpinner, setLoadingSpinner] = useState<boolean>(false);
    const [ordenes, setOrdenes] = useState<IOrdenPendiente[]>([]);
    const { search, setSearch, filteredData } = useFilteredData(ordenes);
    const columns = [
        {
            name: 'Documento',
            selector: (row: IOrdenPendiente) => row.cedula,
        },
        {
            name: 'Usuario',
            selector: (row: IOrdenPendiente) => row.usuario,
        },
        {
            name: 'Cargo',
            selector: (row: IOrdenPendiente) =>  row.cargo,
        },
        {
            name: 'Actions',
            cell: (row: IOrdenPendiente) => (
                <button
                    onClick={() => handleGestionarOrden(row.cod_usuario)}
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                >
                    Crear Orden
                </button>
            ),
        },
    ];

    useEffect(() => {
        obtenerSolicitudes()
    }, [])

    const obtenerSolicitudes = async () => {

        setLoadingSpinner(true)
        let response = await obtenerSolicitudesPendientes()
        setLoadingSpinner(false)
        if (response?.error == 0) {
            setOrdenes(response.ordenes)
        }
    }

    const handleGestionarOrden = (codUsuario:number) => {
        navigate('/ordenes-compra/'+ codUsuario, {
            state: { origin: 'solicitud-dotacion' }
        })
    }

    return (
        <>
        <Title title="Gestionar solicitudes de dotación pendientes" />
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
            />

            <LoadingSpinnerScreen open={openLoadingSpinner} />
        </>
    )
}
