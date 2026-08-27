import React, { useEffect, useState } from 'react';
import LoadingSpinnerScreen from '../../../../components/loadingSpinnerScreen/LoadingSpinnerScreen';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    TextField
} from '@mui/material';
import { PatternFormat } from 'react-number-format';
import Swal from 'sweetalert2';

import { IClienteCrm, ITipoDocumento } from '../../../../interfaces/pos.interface';
import { actualizarClientePos, crearClientePos, obtenerTiposDocumento } from '../../../../actions/pos/pos';

interface Props {
    openDialog: boolean;
    cliente: IClienteCrm;
    onClose: (actualizarUsuario: boolean, documento?:string) => void;
}

export const DialogClientePos = ({
    openDialog,
    cliente,
    onClose
}: Props) => {

    const [openLoadingSpinner, setLoadingSpinner] = useState<boolean>(false);
    const [tiposDocumento, setTiposDocumento] = useState<ITipoDocumento[]>([])
    const {
        handleSubmit,
        watch,
        reset,
        control,
        setValue,
        formState: { isValid }
    } = useForm<IClienteCrm>({
        defaultValues: cliente,
        mode: 'onChange'
    });

    const tipoDocumento = watch('id_tipo_documento');

    useEffect(() => {
        reset(cliente);
    }, [cliente, reset]);

    useEffect(() => {
      getTiposDocumento()
    }, [])
    
    useEffect(() => {
        if (tipoDocumento !== 2) {
            setValue('dv', 0);
        }
    }, [tipoDocumento, setValue]);

    const onSubmit: SubmitHandler<IClienteCrm> = async (data) => {
        try {

            const dataAux: any = {
                ...data
            };

            // El DV solo debe enviarse para tipo de documento 2
            if (dataAux.id_tipo_documento !== 2) {
                dataAux.dv = 0;
            }

            // console.log('dataAux', dataAux);

            if (cliente.id) {
                await updatecliente(cliente.id, dataAux);
            } else {
                await crearcliente(dataAux);
            }

        } catch (e) {
            Swal.fire({
                icon: 'error',
                text: 'Comuniquese con el administrador'
            });
        }
    };

    const crearcliente = async (cliente: any) => {
        try {
            console.log('Nuevo Cliente')
            console.log(cliente)
            delete cliente.fecha;
            delete cliente.id;
            delete cliente.id_tienda;
            delete cliente.id_usuario;
            delete cliente.origen;
            delete cliente.ultima_compra;
           
            setLoadingSpinner(true);

            // Aquí iría tu servicio de creación
            const res = await crearClientePos(cliente);

            setLoadingSpinner(false);

            if (res) {
                await Swal.fire(res.msg);
                if (res?.error === 0) {
                    onClose(true, res.documento);
                }
            }

        } catch (e) {
            setLoadingSpinner(false);

            Swal.fire({
                icon: 'error',
                text: 'Comuniquese con el administrador'
            });
        }
    };

    const updatecliente = async (cod_cliente: number,cliente: any) => {
        try {
            delete cliente.id;
            delete cliente.id_usuario;
            delete cliente.bodega;
            delete cliente.tipo_documento;
            delete cliente.origen;
            delete cliente.compras;
            delete cliente.ultima_compra;
            delete cliente.fecha;
            
            console.log('Cod Cliente', cod_cliente)
            console.log(cliente)
            setLoadingSpinner(true);

            // Aquí iría tu servicio de actualización
            const res = await actualizarClientePos(cod_cliente, cliente);

            setLoadingSpinner(false);

            if (res) {
                Swal.fire(res.msg);
                if (res?.error === 0) {
                    onClose(true,);
                }
            }

        } catch (e) {
            setLoadingSpinner(false);

            Swal.fire({
                icon: 'error',
                text: 'Comuniquese con el administrador'
            });
        }
    };
    
    const getTiposDocumento = async () => {
        try {
           
            setLoadingSpinner(true);

            // Aquí iría tu servicio de actualización
            const res = await obtenerTiposDocumento();

            setLoadingSpinner(false);

            if (res && res?.error === 0) {               
                setTiposDocumento(res.tiposDocumento)
            }

        } catch (e) {
            setLoadingSpinner(false);

            Swal.fire({
                icon: 'error',
                text: 'Comuniquese con el administrador'
            });
        }
    };
    

    return (
        <>
            <Dialog
                open={openDialog}
                onClose={() => onClose(false)}
                aria-labelledby="dialog-cliente-title"
                maxWidth="md"
                fullWidth
            >
                <DialogTitle id="dialog-cliente-title">
                    {cliente.id ? 'Editar cliente' : 'Crear cliente'}
                </DialogTitle>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    autoComplete="off"
                >
                    <DialogContent>
                        <div className="w-full">

                            {/* Encabezado */}
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-800">
                                    Información del cliente
                                </h3>

                                <p className="text-sm text-gray-500">
                                    Completa la información básica del cliente.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">

                                {/* Tipo documento */}
                                <div className="md:col-span-4">
                                    <Controller
                                        name="id_tipo_documento"
                                        control={control}
                                        rules={{
                                            validate: (value) =>
                                                value && value > 0
                                                    ? true
                                                    : 'Seleccione el tipo de documento'
                                        }}
                                        render={({ field, fieldState }) => (
                                            <TextField
                                                {...field}
                                                select
                                                fullWidth
                                                label="Tipo de documento"
                                                variant="outlined"
                                                error={!!fieldState.error}
                                                helperText={fieldState.error?.message}
                                                value={field.value ?? ''}
                                            >
                                                {tiposDocumento.map((tipoDocumento)=>(
                                                    <MenuItem value={tipoDocumento.id}>
                                                    {tipoDocumento.descripcion}
                                                </MenuItem>
                                                ))}
                                            </TextField>
                                        )}
                                    />
                                </div>

                                {/* Documento */}
                                <div className={tipoDocumento === 2 ? "md:col-span-7": "md:col-span-8"}>
                                    <Controller
                                        name="documento"
                                        control={control}
                                        rules={{
                                            required: 'Ingrese el documento'
                                        }}
                                        render={({ field, fieldState }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                label="Documento"
                                                variant="outlined"
                                                error={!!fieldState.error}
                                                helperText={fieldState.error?.message}
                                                value={field.value || ''}
                                                inputProps={{
                                                    inputMode: 'numeric'
                                                }}
                                            />
                                        )}
                                    />
                                </div>

                                {/* DV */}
                                {tipoDocumento === 2 && (
                                    <div className="md:col-span-1">
                                        <Controller
                                            name="dv"
                                            control={control}
                                            rules={{
                                                required: 'Ingrese el DV',
                                                maxLength: {
                                                    value: 1,
                                                    message: 'Máximo 1 dígito'
                                                }
                                            }}
                                            render={({ field, fieldState }) => (
                                                <TextField
                                                    {...field}
                                                    fullWidth
                                                    label="DV"
                                                    variant="outlined"
                                                    error={!!fieldState.error}
                                                    helperText={fieldState.error?.message}
                                                    value={field.value ?? ''}
                                                    inputProps={{
                                                        maxLength: 1,
                                                        inputMode: 'numeric'
                                                    }}
                                                    onChange={(e) => {
                                                        const value = e.target.value
                                                            .replace(/\D/g, '')
                                                            .slice(0, 1);

                                                        field.onChange(value);
                                                    }}
                                                />
                                            )}
                                        />
                                    </div>
                                )}

                                {/* Nombre */}
                                <div className="md:col-span-12">
                                    <Controller
                                        name="nombre"
                                        control={control}
                                        rules={{
                                            required: 'Ingrese el nombre'
                                        }}
                                        render={({ field, fieldState }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                label="Nombre completo"
                                                variant="outlined"
                                                error={!!fieldState.error}
                                                helperText={fieldState.error?.message}
                                                value={field.value || ''}
                                            />
                                        )}
                                    />
                                </div>

                                {/* Teléfono */}
                                <div className="md:col-span-6">
                                    <Controller
                                        name="telefono"
                                        control={control}
                                        rules={{
                                            required: 'Ingrese el teléfono'
                                        }}
                                        render={({ field, fieldState }) => (
                                            <PatternFormat
                                                format="(###)-###-####"
                                                mask="_"
                                                value={field.value || ''}
                                                onValueChange={(values) => {
                                                    field.onChange(values.value);
                                                }}
                                                customInput={TextField}
                                                fullWidth
                                                label="Teléfono"
                                                variant="outlined"
                                                error={!!fieldState.error}
                                                helperText={fieldState.error?.message}
                                            />
                                        )}
                                    />
                                </div>

                                {/* Email */}
                                <div className="md:col-span-6">
                                    <Controller
                                        name="email"
                                        control={control}
                                        rules={{
                                            required: 'Ingrese el correo electrónico',
                                            pattern: {
                                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                message: 'Ingrese un correo válido'
                                            }
                                        }}
                                        render={({ field, fieldState }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                label="Correo electrónico"
                                                variant="outlined"
                                                type="email"
                                                error={!!fieldState.error}
                                                helperText={fieldState.error?.message}
                                                value={field.value || ''}
                                            />
                                        )}
                                    />
                                </div>

                                {/* Dirección */}
                                <div className="md:col-span-8">
                                    <Controller
                                        name="direccion"
                                        control={control}
                                        // rules={{
                                        //     required: 'Ingrese la dirección'
                                        // }}
                                        render={({ field, fieldState }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                label="Dirección"
                                                variant="outlined"
                                                multiline
                                                minRows={1}
                                                error={!!fieldState.error}
                                                helperText={fieldState.error?.message}
                                                value={field.value || ''}
                                            />
                                        )}
                                    />
                                </div>

                                {/* Fecha nacimiento */}
                                <div className="md:col-span-4">
                                    <Controller
                                        name="fecha_nacimiento"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                label="Fecha de nacimiento"
                                                variant="outlined"
                                                type="date"
                                                InputLabelProps={{
                                                    shrink: true
                                                }}
                                                value={field.value || ''}
                                            />
                                        )}
                                    />
                                </div>

                            </div>
                        </div>
                    </DialogContent>

                    <DialogActions className="px-6 py-4 border-t border-gray-200">

                        <Button
                            onClick={() => onClose(false)}
                            color="inherit"
                        >
                            Cancelar
                        </Button>

                        <Button
                            type="submit"
                            variant="contained"
                            disabled={!isValid}
                        >
                            Guardar cliente
                        </Button>

                    </DialogActions>
                </form>
            <LoadingSpinnerScreen open={openLoadingSpinner} />
            </Dialog>

          
        </>
    );
};