import React, { useEffect, useState } from 'react'
import { useFilteredData } from '../../../hooks/useFilteredData';
import { useNavigate } from 'react-router-dom';
import { IoMdDownload } from "react-icons/io";
import DataTable from 'react-data-table-component';
import LoadingSpinnerScreen from '../../../components/loadingSpinnerScreen/LoadingSpinnerScreen';
import { Title } from '../../../components/title/Title';
import { IUsuarioGestionar } from '../../../interfaces/orden_compra.interface';
import { Button } from '@mui/material';
import { obtenerUsuariosCoordinadorGestionar } from '../../../actions/orden_compra/orden_compra';
import clsx from 'clsx';
import { useCartStore } from '../../../store/cart/cart-store';
import { useUserStore } from '../../../store/user/user';
import { reporteComparativo, reporteGeneralEntidad } from '../../../actions/reporte/reporte';
import { IoArrowRedoCircleOutline, IoCheckmark, IoCheckmarkDone } from 'react-icons/io5';
import { DialogGestionOrden } from './components/DialogGestionOrden';
import { formatDate } from '../../../utils/formatDate';
import Swal from 'sweetalert2';
import { editarEntidad } from '../../../actions/entidad/entidad';
import { generarNumeroAleatorio } from '../../../utils/randomNumber';

export const ControlOrdenes = () => {

    const navigate = useNavigate()
    const [openLoadingSpinner, setLoadingSpinner] = useState<boolean>(false);
    const [usuarios, setUsuarios] = useState<IUsuarioGestionar[]>([]);
    const [ordenCompleta, setOrdenCompleta] = useState<boolean>(false);

    const [ordenGestionada, setOrdenGestionada] = useState<boolean>(false);
    const [fechaGestionada, setFechaGestionada] = useState<string>('');
    const [tipoEntrega, setTipoEntrega] = useState<string>('');


    const { search, setSearch, filteredData } = useFilteredData(usuarios);
    const clearCart = useCartStore((state) => state.clearCart)
    const session = useUserStore((state) => state.user)

    const [open, setOpen] = useState(false);

    const columns = [
        {
            name: 'Cédula',
            selector: (row: IUsuarioGestionar) => row.cedula,
        },
        {
            name: 'Nombre',
            selector: (row: IUsuarioGestionar) => row.nombre,
        },
        {
            name: 'Email',
            selector: (row: IUsuarioGestionar) => row.email,
        },
        {
            name: 'Cargo',
            selector: (row: IUsuarioGestionar) => row.cargo_entidad || '',
        },
        {
            name: 'Sexo',
            selector: (row: IUsuarioGestionar) => (row.sexo === "F" ? "Femenino" : "Masculino"),
        },
        {
            name: 'Activo',
            selector: (row: IUsuarioGestionar) => ((row.activo === 1) ? 'Si' : 'No'),
            sortable: true,
        },
        {
            name: 'Aceptó políticas',
            selector: (row: IUsuarioGestionar) => ((row.cod_orden ) ? 'Si' : 'No'),
        },
        {
            name: 'Acciones',
            cell: (row: IUsuarioGestionar) => {

                if (tipoEntrega.length === 0 || tipoEntrega === 'FISICO') {
                   return (
                    <Button disabled>No aplica</Button>
                   )
                } else if (row.cod_orden) {
                    // Orden Completa, verlo en resumen
                    return (
                        <button
                            type='button'
                            className='py-0.5 px-1 my-1 border-2 rounded-sm hover:text-white transition-colors duration-300 border-green-500 text-green-500 hover:bg-green-500'
                            onClick={() => navigate('/resumen_orden/' + row.cod_usuario,
                                {
                                    state: { origin: 'control-ordenes' }
                                }
                            )}
                        >
                            Ver Orden
                        </button>
                    )
                } else {
                    return (
                        <button
                            disabled={!!row.cod_orden}
                            onClick={() => navigate('/ordenes-compra/' + row.cod_usuario)}
                            className='p-0.5 py-0.5 px-1 my-1 border-2 rounded-sm hover:text-white transition-colors duration-300 border-blue-500 text-blue-500 hover:bg-blue-500'
                        >
                            Crear Orden
                        </button>
                    )
                }


            }
        },
    ];

    useEffect(() => {
        obtenerSolicitudes()
        clearCart()
    }, [])

    const obtenerSolicitudes = async () => {

        setLoadingSpinner(true)
        let response = await obtenerUsuariosCoordinadorGestionar()
        setLoadingSpinner(false)
        if (response?.error == 0) {
            setUsuarios(response.usuarios)
            let ordenCompleta = response.usuarios.every(usuario => !!usuario.cod_orden);
            setOrdenCompleta(ordenCompleta)
            setOrdenGestionada(response.gestionada)
            setFechaGestionada(response.fecha_gestionada || '')
            setTipoEntrega(response.entrega_bonos || '')
        }
    }

    const handleDescargarReporte = async () => {
        await reporteGeneralEntidad(session?.cod_entidad || 0)
    }

    const handleDescargarComparativo = async () => {
        await reporteComparativo(session?.cod_entidad || 0)
    }

    const handleClose = (gestionarOrden: boolean) => {
        if (gestionarOrden) {
            obtenerSolicitudes()
        }
        setOpen(false);
    };

    const actualizarEntidad = async () => {
        try {
    
          const currentDate = new Date();
          const colombiaOffset = -5; // Colombia es UTC-5
          const offsetInMillis = colombiaOffset * 60 * 60 * 1000; // Offset en milisegundos
    
          // Obtener la fecha en UTC
          const utcDate = currentDate.toISOString();
          // Convertir a la fecha en Colombia
          const colombiaDate = new Date(currentDate.getTime() + offsetInMillis);
          // Obtener la fecha en formato ISO 8601 en la zona horaria de Colombia
          const colombiaDateISOString = colombiaDate.toISOString();
    
          let aux = {
            gestionada: true,
            fecha_gestionada: colombiaDateISOString,
            no_orden: generarNumeroAleatorio(7)
          }
          let res = await editarEntidad(aux, session?.cod_entidad || 0)
          if (res) {
            Swal.fire(res.msg)
            if(res.error === 0){
                obtenerSolicitudes()
            }
          }
    
        } catch (e) {
          Swal.fire({
            icon: "error",
            text: "Comuniquese con el administrador"
          })
        }
      }


    return (
        <>
            <Title title="Control de ordenes" />
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Buscar..."
                    className="border rounded p-2 mx-6"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <Button variant='contained' startIcon={<IoMdDownload />} onClick={handleDescargarReporte}>Reporte General</Button>
                <div className='mx-4 inline-block'>
                    <Button variant='contained'color='secondary' startIcon={<IoMdDownload />} onClick={handleDescargarComparativo}>Descargar Comparativo</Button>
                </div>
                {
                    (tipoEntrega.length === 0) &&
                    <div className='mx-4 inline-block'>
                        <Button

                            variant='contained'
                            color="success"
                            startIcon={<IoArrowRedoCircleOutline />}
                            onClick={() => setOpen(true)}>
                            Tramitar entrega
                        </Button>
                    </div>
                }

                {
                    (ordenCompleta && !ordenGestionada && tipoEntrega === "VIRTUAL")  &&
                        <div className='mx-4 inline-block'>
                            <Button

                                variant='contained'
                                color="success"
                                startIcon={<IoCheckmark />}
                                onClick={() => actualizarEntidad()}>
                                Finalizar Orden Entrega
                            </Button>
                        </div>
                }


                {
                   ( !!ordenGestionada && tipoEntrega.length > 0)  &&
                    <div className='inline-block'>
                        <div className=' flex flex-row items-center m-0 mx-4 p-2 bg-green-600 rounded-sm max-w-md'>
                            <IoCheckmarkDone color='white' size={30} />
                            <p className='text-white text-lg '>Orden Gestionada ( {formatDate(fechaGestionada)} )</p>
                        </div>
                    </div>
                }

            </div>
            <DataTable
                columns={columns}
                data={filteredData}
                pagination
                highlightOnHover
            />

            <LoadingSpinnerScreen open={openLoadingSpinner} />

            <DialogGestionOrden
                codEntidad={session?.cod_entidad || 0}
                openDialog={open} onClose={handleClose}
            />
        </>
    )
}
