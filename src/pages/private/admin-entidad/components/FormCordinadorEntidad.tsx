import React, { useEffect, useState } from 'react'
import LoadingSpinnerScreen from '../../../../components/loadingSpinnerScreen/LoadingSpinnerScreen';
import { Button, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { IUsuarioEntidadResumen } from '../../../../interfaces/entidad.interface';
import Swal from 'sweetalert2';
import { actualizarUsuarioEntidad, crearUsuarioEntidad, obtenerUsuariosCoordinador } from '../../../../actions/entidad/entidad';



interface Props {
    codEntidad: number;
}

const defaultUsuario: IUsuarioEntidadResumen = {
    cod_usuario: 0,
    email: '',
    nombre: '',
    activo: 1,
    sexo: 'M',
    cedula: '',
    cod_cargo_entidad: 0
}


export const FormCordinadorEntidad = ({ codEntidad }: Props) => {

    const [openLoadingSpinner, setLoadingSpinner] = useState<boolean>(false)
    const { register, handleSubmit, reset, control, formState: { isValid }, watch } = useForm<IUsuarioEntidadResumen>({
        defaultValues: defaultUsuario
    });

    useEffect(() => {
        getUsuarioCoordinador()
    }, [codEntidad])

    const getUsuarioCoordinador = async () => {
        setLoadingSpinner(true)
        let response = await obtenerUsuariosCoordinador(codEntidad)
        setLoadingSpinner(false)
        if (response?.error == 0 && response.usuario) {
            reset(response.usuario)
        }
    }


    const onSubmit: SubmitHandler<IUsuarioEntidadResumen> = async (data) => {

        let dataAux: any = {
            ...data,
            cod_entidad: codEntidad,
            cod_perfil: 2
        }
        delete dataAux.cod_usuario
        delete dataAux.cod_orden

        if (!!watch('cod_usuario') && watch('cod_usuario') != 0) {
            updateUsuarioEntidad(dataAux)
        } else {
            crearUsuario(dataAux)
        }
    }

    const crearUsuario = async (data: Partial<IUsuarioEntidadResumen>) => {
        try {
            setLoadingSpinner(true)
            let res = await crearUsuarioEntidad(data)
            setLoadingSpinner(false)
            if (res) {
                await Swal.fire(res.msg)
                if (res?.error == 0) {
                    getUsuarioCoordinador()
                }
            }

        } catch (e) {
            Swal.fire({
                icon: "error",
                text: "Comuniquese con el administrador"
            })
        }
    }

    const updateUsuarioEntidad = async (data: Partial<IUsuarioEntidadResumen>) => {
        try {

            setLoadingSpinner(true)
            let res = await actualizarUsuarioEntidad(watch('cod_usuario'), data)
            setLoadingSpinner(false)
            if (res) {
                Swal.fire(res.msg)
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


            <form onSubmit={handleSubmit(onSubmit)} className='flex justify-center'>


                <div className="flex flex-col justify-center  m-0 w-96">
                    <Controller
                        name="nombre"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (

                            <div className="my-2 w-full">


                                <TextField
                                    fullWidth
                                    label="Nombre"
                                    variant="outlined"
                                    {...field}
                                    value={field.value || ''}
                                />
                            </div>
                        )}
                    />

                    <Controller
                        name="cedula"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (

                            <div className="my-2 w-full">


                                <TextField
                                    fullWidth
                                    label="Cédula"
                                    variant="outlined"
                                    {...field}
                                    value={field.value || ''}
                                />
                            </div>
                        )}
                    />

                    <Controller
                        name="email"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (

                            <div className="my-2 w-full">


                                <TextField
                                    fullWidth
                                    label="Email"
                                    variant="outlined"
                                    type="email"
                                    {...field}
                                    value={field.value || ''}
                                />
                            </div>
                        )}
                    />

                    <Controller
                        name="password"
                        control={control}
                        rules={{ required: false }}
                        render={({ field }) => (

                            <div className="my-2 w-full">


                                <TextField
                                    fullWidth
                                    label="Contraseña"
                                    variant="outlined"
                                    type="password"
                                    placeholder={field.value ? '' : '*******'}
                                    {...field}
                                    value={field.value || ''}
                                />
                            </div>
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

                    <Controller
                        name="sexo"
                        control={control}
                        render={({ field }) => (
                            <>
                                <InputLabel id="sexo" className='mt-4'>sexo</InputLabel>
                                <Select
                                    labelId="sexo"
                                    {...field}
                                    label="sexo"
                                >
                                    <MenuItem value={'M'}>Masculino</MenuItem>
                                    <MenuItem value={'F'}>Femenino</MenuItem>
                                </Select>
                            </>
                        )}
                    />

                    <Button type='submit' disabled={!isValid}>
                        Guardar usuario
                    </Button>
                </div>
            </form>

            <LoadingSpinnerScreen open={openLoadingSpinner} />

        </>
    )

}
