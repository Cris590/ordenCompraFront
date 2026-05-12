import React, { useEffect, useState } from 'react'
import { Button, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { IProductoInformacionBasica } from '../../../../interfaces/producto.interface';
import { obtenerCategorias } from '../../../../actions/categorias/categorias';
import { ICategories } from '../../../../interfaces/categoria.interface';
import { crearProducto, editarProducto, obtenerInfoBasicaProducto } from '../../../../actions/producto/producto';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import LoadingSpinnerScreen from '../../../../components/loadingSpinnerScreen/LoadingSpinnerScreen';

interface Props {
    codProducto?: string
}


const defaulValueProducto: IProductoInformacionBasica = {
    nombre: '',
    cod_categoria: 0,
    activo: 0,
    descripcion: ''
}



export const InformacionBasicaProducto = ({ codProducto }: Props) => {

    const [openLoadingSpinner, setLoadingSpinner] = useState<boolean>(false)
    const [categorias, setCategorias] = useState<ICategories[]>([]);

    const navigate = useNavigate();

    useEffect(() => {
        obtenerTodasCategorias()
        if (codProducto && +codProducto !== 0) {
            obtenerInfoBasicaDelProducto(codProducto)
        } else {
            reset(defaulValueProducto)
        }
    }, [codProducto])

    const obtenerTodasCategorias = async () => {
        let response = await obtenerCategorias()
        if (response?.error === 0) {
            setCategorias(response.categorias)
        }
    }

    const obtenerInfoBasicaDelProducto = async (codProducto: string) => {
        let response = await obtenerInfoBasicaProducto(codProducto)
        if (response?.error === 0) {
            if (Object.keys(response.producto).length === 0) {
                navigate('/')
            }
            reset(response.producto)
        }
    }

    const { handleSubmit, reset, control, formState: { isValid } } = useForm<IProductoInformacionBasica>({
        defaultValues: defaulValueProducto
    });

    const onSubmit: SubmitHandler<IProductoInformacionBasica> = async (data) => {

        if (!codProducto || +codProducto === 0) {
            setLoadingSpinner(true)
            let response = await crearProducto(data);
            setLoadingSpinner(false)
            if (response) {
                if (response.error === 0) {
                    navigate('/productos/editar-producto/' + response.cod_producto)
                }
            }
        } else {
            setLoadingSpinner(true)
            let response = await editarProducto(data, +codProducto);
            setLoadingSpinner(false)
            if (response) {
                if (response.error === 0) {
                    if (response) {
                        Swal.fire(response.msg)
                    }
                }
            }
        }


    }




    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} >

                <div className="flex flex-col mt-4">
                    <Controller
                        name="nombre"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <TextField
                                label="Nombre"
                                variant="outlined"
                                {...field}
                                value={field.value || ''}
                            />
                        )}
                    />

                    <Controller
                        name="cod_categoria"
                        control={control}
                        rules={{ required: 'Categoria es obligatorio' }}
                        render={({ field }) => (
                            <>
                                <InputLabel id="Categoria" className='mt-4'>Categoria</InputLabel>

                                <Select
                                    {...field}
                                    label="Categoria"
                                    labelId="Categoria"
                                >
                                    {categorias.map((categoria) => (<MenuItem key={categoria.cod_categoria} value={categoria.cod_categoria}>{categoria.nombre}</MenuItem>))}
                                </Select>
                            </>
                        )}
                    />

                    <Controller
                        name="activo"
                        control={control}
                        render={({ field }) => (
                            <>
                                <InputLabel id="activo" className='mt-4'>Activo</InputLabel>
                                <Select
                                    labelId="activo"
                                    {...field}
                                    label="Activo"
                                >
                                    <MenuItem value={1}>Activo</MenuItem>
                                    <MenuItem value={0}>Inactivo</MenuItem>
                                </Select>
                            </>
                        )}
                    />

                    <br/>
                    <Controller
                        name="descripcion"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <TextField
                                label="Descripción"
                                variant="outlined"
                                {...field}
                                value={field.value || ''}
                            />
                        )}
                    />


                    <Button disabled={!isValid} type='submit'>
                        {(!codProducto || +codProducto === 0) ? 'Crear Producto' : 'Editar Producto'}
                    </Button>
                </div>
            </form>
            <LoadingSpinnerScreen open={openLoadingSpinner} />

        </>
    )
}
