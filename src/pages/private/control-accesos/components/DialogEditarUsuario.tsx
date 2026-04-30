import React, { useEffect, useState } from 'react'
import LoadingSpinnerScreen from '../../../../components/loadingSpinnerScreen/LoadingSpinnerScreen';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { actualizarUsuarioEntidad, cargosPorEntidad, crearUsuarioEntidad } from '../../../../actions/entidad/entidad';
import Swal from 'sweetalert2';
import { useEntidadStore } from '../../../../store/entidad/entidad';
import { IUsuarioAplicacionResumen } from '../../../../interfaces/control_accesos.interface';
import { editarUsuarioAplicativo } from '../../../../actions/control-accesos/control-accesos';


interface Props {
    openDialog: boolean;
    usuario: IUsuarioAplicacionResumen;
    onClose: (actualizarUsuario: boolean) => void;
}

export const DialogEditarUsuario = ({ openDialog, usuario, onClose }: Props) => {

    const [openLoadingSpinner, setLoadingSpinner] = useState<boolean>(false)
    const { handleSubmit, reset, control, formState: { isValid } } = useForm<IUsuarioAplicacionResumen>({
        defaultValues: usuario
    });

    useEffect(() => {
        reset(usuario)
    }, [usuario])

    const onSubmit: SubmitHandler<IUsuarioAplicacionResumen> = async (data) => {



        try {

            let dataAux: any = {
                ...data,
            }
            delete dataAux.cod_usuario
            delete dataAux.cod_perfil
            delete dataAux.perfil

            dataAux.cedula = dataAux.usuario
            delete dataAux.usuario

            setLoadingSpinner(true)
            let res = await editarUsuarioAplicativo(data.cod_usuario, dataAux)
            setLoadingSpinner(false)
            if (res) {
                await Swal.fire(res.msg)
                if (res?.error == 0) {
                    onClose(true)
                }
            }

        } catch (e) {
            Swal.fire({
                icon: "error",
                text: "Comuniquese con el administrador"
            })
        }
    }

    const crearUsuario = async (data: Partial<IUsuarioAplicacionResumen>) => {
        try {
            setLoadingSpinner(true)
            let res = await crearUsuarioEntidad(data)
            setLoadingSpinner(false)
            if (res) {
                await Swal.fire(res.msg)
                if (res?.error == 0) {
                    onClose(true)
                }
            }

        } catch (e) {
            Swal.fire({
                icon: "error",
                text: "Comuniquese con el administrador"
            })
        }
    }

    const updateUsuarioEntidad = async (data: Partial<IUsuarioAplicacionResumen>) => {
        try {
            setLoadingSpinner(true)
            let res = await actualizarUsuarioEntidad(usuario.cod_usuario, data)
            setLoadingSpinner(false)
            if (res) {
                Swal.fire(res.msg)
                if (res?.error == 0) {
                    onClose(true)
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

            <Dialog
                open={openDialog}
                onClose={() => onClose(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth='lg'
            >
                <DialogTitle id="alert-dialog-title">
                    {usuario.cod_usuario ? 'Editar Usuario' : 'Crear Usuario'}
                </DialogTitle>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogContent>


                        <div className="flex flex-col mt-4 w-96">
                            <Controller
                                name="nombre"
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => (

                                    <div className="my-2 w-96">


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
                                name="usuario"
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => (

                                    <div className="my-2 w-96">


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

                                    <div className="my-2 w-96">


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

                                    <div className="my-2 w-96">


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
                                name="perfil"
                                control={control}
                                rules={{ required: false }}
                                render={({ field }) => (

                                    <div className="my-2 w-96">


                                        <TextField
                                            fullWidth
                                            label="Perfil"
                                            variant="outlined"
                                            disabled={true}
                                            {...field}
                                            value={field.value || ''}
                                        />
                                    </div>
                                )}
                            />

                        </div>



                    </DialogContent>

                    <DialogActions>
                        <Button onClick={() => onClose(false)}>Cancelar</Button>
                        <Button type='submit' disabled={!isValid}>
                            Guardar usuario
                        </Button>
                    </DialogActions>
                </form>

            </Dialog>


            <LoadingSpinnerScreen open={openLoadingSpinner} />

        </>
    )
}
