import React, { useEffect, useState } from 'react'
import LoadingSpinnerScreen from '../../../../components/loadingSpinnerScreen/LoadingSpinnerScreen';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogTitle, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { actualizarUsuarioEntidad, cargosPorEntidad, crearUsuarioEntidad } from '../../../../actions/entidad/entidad';
import Swal from 'sweetalert2';
import { useEntidadStore } from '../../../../store/entidad/entidad';
import { IEntidadTarjetaBono, IPerfilAplicacion, IUsuarioAplicacionResumen } from '../../../../interfaces/control_accesos.interface';
import { crearUsuarioAplicativo, editarUsuarioAplicativo, obtenerPerfilesAplicativo } from '../../../../actions/control-accesos/control-accesos';
import { obtenerTiendasPosUsuario, obtenerVendedoresCrm } from '../../../../actions/pos/pos';
import { IVendedorCrm } from '../../../../interfaces/pos.interface';


interface Props {
    openDialog: boolean;
    usuario: IUsuarioAplicacionResumen;
    entidades: IEntidadTarjetaBono[];
    onClose: (actualizarUsuario: boolean) => void;
}

export const DialogEditarUsuario = ({ openDialog, usuario, onClose, entidades }: Props) => {

    const [openLoadingSpinner, setLoadingSpinner] = useState<boolean>(false)
    const [perfiles, setPerfiles] = useState<IPerfilAplicacion[]>([])
    const [tiendas, setTiendas] = useState<{id:number, nombre:string}[]>([])
    const [vendedoresCrm, setVendedoresCrm] = useState<IVendedorCrm[]>([])
    const { handleSubmit, watch, reset, control, formState: { isValid } } = useForm<IUsuarioAplicacionResumen>({
        defaultValues: usuario
    });

    useEffect(() => {
        reset(usuario)
        // obtenerPerfiles()
    }, [usuario])

    useEffect(() => {
        obtenerPerfiles()
        obtenerTiendas()
        obtenerVendedores()
    }, [openDialog])


    const obtenerPerfiles = async () => {
        try {

            let res = await obtenerPerfilesAplicativo()
            if (res?.error) {
                Swal.fire(res.msg)
            } else {
                setPerfiles(res?.perfiles || [])
            }

        } catch (e) {
            Swal.fire({
                icon: "error",
                text: "Comuniquese con el administrador"
            })
        }
    }

    const obtenerTiendas = async () => {
        try {

            let res = await obtenerTiendasPosUsuario()
            if (res?.error) {
                Swal.fire(res.msg)
            } else {
                setTiendas(res?.bodegas || [])
            }

        } catch (e) {
            Swal.fire({
                icon: "error",
                text: "Comuniquese con el administrador"
            })
        }
    }

    const obtenerVendedores = async () => {
        try {

            let res = await obtenerVendedoresCrm()
            if (res?.error) {
                Swal.fire(res.msg)
            } else {
                setVendedoresCrm(res?.vendedores || [])
            }

        } catch (e) {
            Swal.fire({
                icon: "error",
                text: "Comuniquese con el administrador"
            })
        }
    }

    const onSubmit: SubmitHandler<IUsuarioAplicacionResumen> = async (data) => {
        try {

            let dataAux: any = {
                ...data,
            }
           

            dataAux.cedula = dataAux.usuario
            delete dataAux.usuario

            dataAux.entidades = JSON.stringify(dataAux.entidades)

            console.log('dataAux',dataAux)

            if(!!usuario.cod_usuario){
                await updateUsuario(usuario.cod_usuario, dataAux)
            }else{
                await crearUsuario(dataAux)
            }
           

        } catch (e) {
            Swal.fire({
                icon: "error",
                text: "Comuniquese con el administrador"
            })
        }
    }

    const crearUsuario = async (data: any) => {
        try {
            delete data.cod_usuario
            delete data.perfil
            setLoadingSpinner(true)
            let res = await crearUsuarioAplicativo(data)
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

    const updateUsuario = async (cod_usuario:number, data: any) => {
        try {
            delete data.cod_usuario
            delete data.cod_perfil
            delete data.perfil
            setLoadingSpinner(true)
            let res = await editarUsuarioAplicativo(cod_usuario, data)
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

    const perfil = watch("cod_perfil");

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
                <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
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
                                            autoComplete="off"
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
                                rules={{ required: (!usuario.cod_usuario) }}
                                render={({ field }) => (

                                    <div className="my-2 w-96">


                                        <TextField
                                            fullWidth
                                            label="Contraseña"
                                            variant="outlined"
                                            type="password"
                                            autoComplete="off"
                                            placeholder={field.value ? '' : '*******'}
                                            {...field}
                                            value={field.value || ''}
                                        />
                                    </div>
                                )}
                            />

                            <Controller
                                name="cod_perfil"
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <>
                                        <InputLabel id="perfil" className='mt-4'>Perfil</InputLabel>
                                        <Select
                                            disabled={!!usuario.cod_usuario}
                                            labelId="perfil"
                                            {...field}
                                            label="perfil"
                                        >
                                            {perfiles.map((perfil) => (<MenuItem value={perfil.cod_perfil}>{perfil.nombre} </MenuItem>))}
                                        </Select>
                                    </>
                                )}
                            />


                            <br />
                            {
                                // Entidades para el perfil de atención de bonos
                                [6].includes(perfil) &&
                                <Controller
                                    name="entidades"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field }) => {
                                        return (
                                            <Autocomplete
                                                multiple
                                                options={entidades}
                                                getOptionLabel={(option) => option.nombre}

                                                // 🔹 Mostrar seleccionados (form → UI)
                                                value={entidades.filter(ent =>
                                                    field.value?.includes(ent.cod_entidad)
                                                )}

                                                // 🔹 Guardar en el form (UI → form)
                                                onChange={(_, newValue) => {
                                                    field.onChange(newValue.map(v => v.cod_entidad));
                                                }}

                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        variant="standard"
                                                        label="Entidades"
                                                        placeholder="Buscar entidad"
                                                    />
                                                )}
                                            />
                                        );
                                    }}
                                />
                            }


                            {
                                [8].includes(perfil) &&<>
                                <Controller
                                    name="id_bodega"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <>
                                            <InputLabel id="tienda" className='mt-1'>Tienda</InputLabel>
                                            <Select
                                                labelId="tienda"
                                                {...field}
                                                label="tienda"
                                            >
                                                {tiendas.map((bodega) => (<MenuItem value={bodega.id}>{bodega.nombre} </MenuItem>))}
                                            </Select>
                                        </>
                                    )}
                                />

                                <Controller
                                    name="id_usuario_crm"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <>
                                            <InputLabel id="id_usuario_crm" className='mt-1'>Vendedor Crm</InputLabel>
                                            <Select
                                                labelId="id_usuario_crm"
                                                {...field}
                                                label="id_usuario_crm"
                                            >
                                                {vendedoresCrm.map((vendedor) => (<MenuItem value={vendedor.id}>{vendedor.usuario} - {vendedor.nombre} </MenuItem>))}
                                            </Select>
                                        </>
                                    )}
                                />

                            </>

                            
                            }
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
