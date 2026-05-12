import React, { useEffect, useState } from 'react'
import { ISubCategoriaASociada } from '../../../../../interfaces/entidad.interface'
import { IconButton, TextField, Tooltip } from '@mui/material'
import { IoAddCircle, IoBan, IoRefreshCircle, IoTrash } from 'react-icons/io5'
import { currencyFormat } from '../../../../../utils/currencyFormat'
import { Controller, useForm } from 'react-hook-form'
import Swal from 'sweetalert2'
import { asociarSubCategoriaCargoCrm, borrarAsociacionSubCategoriaBonosProducto, editarAsociacionSubCategoriaBonosProducto } from '../../../../../actions/entidad/entidad'
import LoadingSpinnerScreen from '../../../../../components/loadingSpinnerScreen/LoadingSpinnerScreen'


interface Props {
    subcategoria: ISubCategoriaASociada,
    codCargoBonoProducto: number,
    crear?: boolean,
    inputRef?: React.RefObject<HTMLInputElement | null>;
    cerrarNuevaAsociacion: () => void;
    maxValue: number;
    actualizarAsociaciones: (actualizar: boolean) => void
}
export const CardSubCategoria = ({
    subcategoria,
    codCargoBonoProducto,
    inputRef,
    cerrarNuevaAsociacion,
    maxValue,
    actualizarAsociaciones,
    crear = false
}: Props) => {


    const { register, handleSubmit, reset, control, formState: { isValid }, watch } = useForm<ISubCategoriaASociada>({
        defaultValues: subcategoria
    });

    const [openLoadingSpinner, setLoadingSpinner] = useState<boolean>(false)

    useEffect(() => {
        reset(subcategoria);
    }, [subcategoria, reset]);

    const desasociarSubCategoria = async () => {
        try {

            Swal.fire({
                title: "¿Estás segur@?",
                text: "Esta acción no se puede revertir!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Si, borrar asociación!"
            }).then(async (result) => {
                if (result.isConfirmed) {
                    setLoadingSpinner(true)
                    let response = await borrarAsociacionSubCategoriaBonosProducto(subcategoria.cod_producto_asociado_subcategoria || 0)
                    setLoadingSpinner(false)

                    if (response) {
                        Swal.fire(response.msg)
                        actualizarAsociaciones(true)
                        cerrarNuevaAsociacion()
                    }

                }

            });
        } catch (e) {
            Swal.fire({
                icon: 'error',
                text: 'Error al obtener detalles del cargo'
            })
        }


    }


    const onSubmit = () => {

    }

    const asociarSubCategoria = async () => {
        try {
            const data = {
                cod_cargo_bonos_producto: codCargoBonoProducto,
                cod_subcategoria: subcategoria.cod_subcategoria,
                valor: watch('valor')
            }

            setLoadingSpinner(true)
            let response = await asociarSubCategoriaCargoCrm(data)
            setLoadingSpinner(false)
           
            if (response) {
                Swal.fire(response.msg)
                actualizarAsociaciones(true)
                if (cerrarNuevaAsociacion) cerrarNuevaAsociacion()
            }
        
        } catch (e) {
            Swal.fire({
                icon: 'error',
                text: 'Error al obtener detalles del cargo'
            })
        }

    }

    const actualizarAsociacion = async () => {
        try {
            const data = {
                valor: watch('valor')
            }

            setLoadingSpinner(true)
            let response = await editarAsociacionSubCategoriaBonosProducto(data, subcategoria.cod_producto_asociado_subcategoria || 0)
            setLoadingSpinner(false)
            
                if (response) {
                    Swal.fire(response.msg)
                    actualizarAsociaciones(true)
                    cerrarNuevaAsociacion()
                }
            
        } catch (e) {
            Swal.fire({
                icon: 'error',
                text: 'Error al obtener detalles del cargo'
            })
        }

    }


    return (
        <div className="flex flex-col gap-4 w-full my-3 p-3">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex items-end gap-4 w-full"
            >

                {/* ID */}
                <Controller
                    name="cod_subcategoria"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                        <div className="w-24">
                            <TextField
                                fullWidth
                                label="Id"
                                variant="outlined"
                                {...field}
                                value={field.value || ''}
                                disabled
                            />
                        </div>
                    )}
                />

                {/* Subcategoria */}
                <Controller
                    name="nombre"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                        <div className="flex-1 min-w-[200px]">
                            <TextField
                                fullWidth
                                label="Sub Categoria"
                                variant="outlined"
                                {...field}
                                value={field.value || ''}
                                disabled
                            />
                        </div>
                    )}
                />

                {/* Valor */}
                <Controller
                    name="valor"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                        <div className="w-40">
                            <TextField
                                fullWidth
                                label="Valor"
                                variant="outlined"
                                type="number"
                                inputRef={inputRef}
                                {...field}
                                value={field.value || ''}
                                onChange={(e) =>
                                    field.onChange(Number(e.target.value))
                                }
                                InputProps={{
                                    startAdornment: (
                                        <span className="mr-2 text-gray-500">$</span>
                                    )
                                }}
                            />
                        </div>
                    )}
                />

                {/* Icono */}
                <div className="flex items-center justify-center pb-1">

                    {
                        crear ? (
                            <div>
                                <Tooltip title="Asociar subcategoria">
                                    <IconButton onClick={asociarSubCategoria} color='success' disabled={watch('valor') > (maxValue || 0)}>
                                        <IoAddCircle size={24} />
                                    </IconButton>
                                </Tooltip>

                                <Tooltip title="Cancelar asociacion">
                                    <IconButton onClick={cerrarNuevaAsociacion} color='error'>
                                        <IoBan size={24} />
                                    </IconButton>
                                </Tooltip>

                            </div>

                        ) : (

                            <div className='flex'>
                                <Tooltip title="Actualizar valor">
                                    <IconButton onClick={actualizarAsociacion} color="primary" disabled={watch('valor') > (maxValue || 0)}>
                                        <IoRefreshCircle size={22} />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Desasociar categoria" color='error'>
                                    <IconButton onClick={desasociarSubCategoria} >
                                        <IoTrash size={22} />
                                    </IconButton>
                                </Tooltip>


                            </div>



                        )
                    }

                </div>

            </form>
            {(watch('valor') > (maxValue || 0)) && <p className='text-red-500 font-bold'>El valor de los productos no puede ser mayor al valor del bono</p>}
            <LoadingSpinnerScreen open={openLoadingSpinner} />
        </div>
    )
}
