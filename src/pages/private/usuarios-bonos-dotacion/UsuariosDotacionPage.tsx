import React, { useEffect, useState } from 'react'
import { Title } from '../../../components/title/Title';
import { Button } from '@mui/material';
import DataTable from 'react-data-table-component';
import LoadingSpinnerScreen from '../../../components/loadingSpinnerScreen/LoadingSpinnerScreen';
import { useFilteredData } from '../../../hooks/useFilteredData';
import { IFiltroBonoBusqueda, IUsuarioBonoBusqueda } from '../../../interfaces/entidad_bonos.interface';
import { consultarBonosFiltro } from '../../../actions/entidad_bono/entidad_bono';
import { FiltroBusquedaBonos } from './components/FiltroBusquedaBonos';
import Swal from 'sweetalert2';
import clsx from 'clsx';
import { DialogRedencionBonos } from './components/DialogRedencionBonos';

export const UsuariosDotacionPage = () => {

    const [usuarios, setUsuarios] = useState<IUsuarioBonoBusqueda[]>([]);
    const [openLoadingSpinner, setOpenLoadingSpinner] = useState(false)
    const { search, setSearch, filteredData } = useFilteredData(usuarios);
    const [openDialogRedencion, setOpenDialogRedencion] = useState(false)
    const [codUsuarioRedimir, setCodUsuarioRedimir] = useState<number>(0)
    const [filtroBusquedaAux, setFiltroBusquedaAux] = useState<IFiltroBonoBusqueda>({})

    const columns = [
        {
            name: 'Codigo',
            selector: (row: IUsuarioBonoBusqueda) => row.codigo,
            sortable: true
        },
        {
            name: 'Nombre',
            selector: (row: IUsuarioBonoBusqueda) => row.nombre,
            sortable: true
        },
        {
            name: 'Cedula',
            selector: (row: IUsuarioBonoBusqueda) => row.cedula,
            sortable: true
        },
        {
            name: 'Cargo',
            selector: (row: IUsuarioBonoBusqueda) => row.cargo_entidad,
            sortable: true,
        },
        {
            name: 'Sexo',
            selector: (row: IUsuarioBonoBusqueda) => (row.sexo === "F") ? "Femenino" : "Masculino"
        },
        {
            name: 'Entidad',
            selector: (row: IUsuarioBonoBusqueda) => row.entidad
        },
        {
            name: 'NIT Entidad',
            selector: (row: IUsuarioBonoBusqueda) => row.nit
        },
        {
            name: 'No Contrato',
            selector: (row: IUsuarioBonoBusqueda) => row.no_contrato
        },
        {
            name: 'Estado',
            cell: (row: IUsuarioBonoBusqueda) => {

                if (row.redimido) {
                    return (
                        <Button size='small' color='success'>Bono redimido</Button>
                    )
                } else {
                    return (
                        <Button size='small' color='primary'>Pendiente por redimir</Button>
                    )
                }
            },
        }, {
            name: 'Acciones',
            cell: (row: IUsuarioBonoBusqueda) => (
                <button
                    onClick={() => handleClicGestionarBono(row.cod_usuario  , row.redimido)}

                    className={
                        clsx(
                            "bg-blue-500 text-white px-2 py-1 rounded",
                            {
                                'bg-green-500': row.redimido
                            }
                        )
                    }
                >
                    {row.redimido ? 'Ver información' : 'Redimir Bono'}
                </button>
            )
        },

    ];

    useEffect(() => {
        // obtenerTodosusuarios()
    }, [])

    const handleClicGestionarBono = (codUsuario: number, redimido:boolean) => {
        setOpenDialogRedencion(true)
        setCodUsuarioRedimir(codUsuario)
    };


    const handleBuscarFiltro = async (dataFiltro: IFiltroBonoBusqueda) => {
        setFiltroBusquedaAux(dataFiltro)
        setOpenLoadingSpinner(true)
        let response = await consultarBonosFiltro(dataFiltro)
        setOpenLoadingSpinner(false)
        if (response?.error == 0) {
            setUsuarios(response.usuarios)
        } else if (response?.error == 1) {
            Swal.fire(response.msg)
        }
    }

    const handleCloseDialogRedencion = (actualizar:boolean) => {
        setOpenDialogRedencion(false)
        setCodUsuarioRedimir(0)
        handleBuscarFiltro(filtroBusquedaAux)
    }

    return (

        <>
            <div className='m-6'>

                <FiltroBusquedaBonos handleBuscarFiltro={handleBuscarFiltro} />

                <div className="container mx-auto p-4">
                    <Title title="usuarios" />
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
                        noDataComponent='No Hay datos para mostrar'
                    />
                    <LoadingSpinnerScreen open={openLoadingSpinner} />

                </div>
            </div>

            <DialogRedencionBonos 
                openDialog={openDialogRedencion} 
                codUsuario={codUsuarioRedimir} 
                onClose={handleCloseDialogRedencion}
            /> 
        </>
    )
}
