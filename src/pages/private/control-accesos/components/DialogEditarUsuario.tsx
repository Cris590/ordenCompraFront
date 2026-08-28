import React, { useEffect, useState } from 'react'
import LoadingSpinnerScreen from '../../../../components/loadingSpinnerScreen/LoadingSpinnerScreen';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField } from '@mui/material';
import Swal from 'sweetalert2';
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
    const [tiendas, setTiendas] = useState<{ id: number, nombre: string }[]>([])
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

            if (!!usuario.cod_usuario) {
                await updateUsuario(usuario.cod_usuario, dataAux)
            } else {
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

    const updateUsuario = async (cod_usuario: number, data: any) => {
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

                        <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-2 md:min-w-[700px]">

                            {/* NOMBRE */}
                            <Controller
                                name="nombre"
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <TextField
                                        fullWidth
                                        label="Nombre"
                                        variant="outlined"
                                        {...field}
                                        value={field.value || ""}
                                    />
                                )}
                            />

                            {/* CÉDULA */}
                            <Controller
                                name="usuario"
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <TextField
                                        fullWidth
                                        label="Cédula"
                                        variant="outlined"
                                        autoComplete="off"
                                        {...field}
                                        value={field.value || ""}
                                    />
                                )}
                            />

                            {/* EMAIL */}
                            <Controller
                                name="email"
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        variant="outlined"
                                        type="email"
                                        {...field}
                                        value={field.value || ""}
                                    />
                                )}
                            />

                            {/* CONTRASEÑA */}
                            <Controller
                                name="password"
                                control={control}
                                rules={{
                                    required: !usuario.cod_usuario,
                                }}
                                render={({ field }) => (
                                    <TextField
                                        fullWidth
                                        label="Contraseña"
                                        variant="outlined"
                                        type="password"
                                        autoComplete="new-password"
                                        placeholder={
                                            field.value
                                                ? ""
                                                : "*******"
                                        }
                                        {...field}
                                        value={field.value || ""}
                                    />
                                )}
                            />

                            {/* PERFIL */}
                            <Controller
                                name="cod_perfil"
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        select
                                        fullWidth
                                        label="Perfil"
                                        value={field.value ?? ""}
                                        disabled={!!usuario.cod_usuario}
                                    >
                                        {perfiles.map((perfil) => (
                                            <MenuItem
                                                key={perfil.cod_perfil}
                                                value={perfil.cod_perfil}
                                            >
                                                {perfil.nombre}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                )}
                            />

                            {/* TIENDA */}
                            {[8].includes(perfil) && (
                                <Controller
                                    name="id_bodega"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            select
                                            fullWidth
                                            label="Tienda"
                                            value={field.value ?? ""}
                                        >
                                            {tiendas.map((bodega) => (
                                                <MenuItem
                                                    key={bodega.id}
                                                    value={bodega.id}
                                                >
                                                    {bodega.nombre}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    )}
                                />
                            )}

                            {/* VENDEDORES */}
                            {[8].includes(perfil) && (
                                <Controller
                                    name="id_usuario_crm"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            select
                                            fullWidth
                                            label="Vendedor CRM"
                                            value={field.value ?? ""}
                                        >
                                            {vendedoresCrm.map((vendedor) => (
                                                <MenuItem
                                                    key={vendedor.id}
                                                    value={vendedor.id}
                                                >
                                                    {vendedor.usuario} -{" "}
                                                    {vendedor.nombre}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    )}
                                />
                            )}

                            {/* ENTIDADES */}
                            {[6, 8].includes(perfil) && (
                                <div className="md:col-span-2">
                                    <Controller
                                        name="entidades"
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <Autocomplete
                                                multiple
                                                fullWidth
                                                options={entidades}
                                                getOptionLabel={(option) =>
                                                    option.nombre
                                                }

                                                value={entidades.filter(
                                                    (ent) =>
                                                        field.value?.includes(
                                                            ent.cod_entidad
                                                        )
                                                )}

                                                onChange={(_, newValue) => {
                                                    field.onChange(
                                                        newValue.map(
                                                            (v) =>
                                                                v.cod_entidad
                                                        )
                                                    );
                                                }}

                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Entidades"
                                                        placeholder="Buscar entidad"
                                                    />
                                                )}
                                            />
                                        )}
                                    />
                                </div>
                            )}

                        </div>

                    </DialogContent>

                    <DialogActions>
                        <Button onClick={() => onClose(false)}>Cancelar</Button>
                        <Button type='submit' disabled={!isValid}>
                            Guardar usuario
                        </Button>
                    </DialogActions>
                </form>
                <LoadingSpinnerScreen open={openLoadingSpinner} />
            </Dialog>
        </>
    )
}
