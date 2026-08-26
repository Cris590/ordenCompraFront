import React, { useEffect, useState } from 'react'
import LoadingSpinnerScreen from '../../../../../components/loadingSpinnerScreen/LoadingSpinnerScreen'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, InputLabel, TextareaAutosize, TextField } from '@mui/material'
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { crearCargoBonoProducto, detalleCargoBonoProducto, editarCargoBonoProducto} from '../../../../../actions/entidad/entidad';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

interface Props {
    openDialog: boolean;
    onClose: (actualizarUsuario: boolean) => void;
    codCargoBonoProducto: number;
    codCargoEntidad: number;
}

interface ICargoBonoProducto {
    nombre: string,
    descripcion: string,
    valor: number,
}

const defaulValueCargo: ICargoBonoProducto = {
    nombre: '',
    descripcion: '',
    valor: 0,
}

export const DialogCrearCargosBonosProducto = ({ codCargoBonoProducto, codCargoEntidad, openDialog, onClose }: Props) => {
    const [openLoadingSpinner, setLoadingSpinner] = useState<boolean>(false)
    const [isFocused, setIsFocused] = useState(false);
    const navigate = useNavigate()
    const { handleSubmit, reset, control, formState: { isValid } } = useForm<ICargoBonoProducto>({
        defaultValues: defaulValueCargo
    });

    useEffect(() => {

        if (codCargoBonoProducto && +codCargoBonoProducto !== 0) {
            obtenerInfoBonoProducto(codCargoBonoProducto)
        } else {
            reset(defaulValueCargo)
        }
    }, [codCargoBonoProducto, openDialog])

    const obtenerInfoBonoProducto = async (codCargoBonoProducto: number) => {
        try {
            setLoadingSpinner(true)
            let response = await detalleCargoBonoProducto(codCargoBonoProducto)
            setLoadingSpinner(false)
            if (response?.error === 0) {
                if (Object.keys(response.cargo_bono).length === 0) {
                    navigate('/entidades/admin-entidad/')
                }

                let cargoBonoAux: ICargoBonoProducto = {
                    nombre: response.cargo_bono.nombre,
                    descripcion: response.cargo_bono.descripcion,
                    valor: response.cargo_bono.valor,

                }
                reset(cargoBonoAux)
            }
        } catch (e) {

        }

    }


    const onSubmit: SubmitHandler<ICargoBonoProducto> = async (data) => {
        let dataAux: any = data
        dataAux.cod_cargo_entidad = codCargoEntidad
        if (!codCargoBonoProducto || +codCargoBonoProducto === 0) {

            setLoadingSpinner(true)
            let response = await crearCargoBonoProducto(dataAux);
            setLoadingSpinner(false)
            if (response) {
                if (response.error === 0) {
                    // navigate('/entidades/admin-entidad/' + response.cod_entidad.toString())
                    onClose(true)
                } else {
                    Swal.fire(response.msg)
                }
            }

        } else {

            setLoadingSpinner(true)

            delete dataAux.cod_cargo_entidad
            let response = await editarCargoBonoProducto(dataAux, +codCargoBonoProducto);
            setLoadingSpinner(false)
            if (response) {
                if (response) {
                    Swal.fire(response.msg)
                    onClose(true)
                }
            }
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
                    Crear Cargo Entidad Bonos
                </DialogTitle>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogContent>


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
                            <br />

                            <Controller
                                name="descripcion"
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <>
                                        <InputLabel className='mt-4'>Información del contrato</InputLabel>
                                        <TextareaAutosize

                                            minRows={2}
                                            placeholder="Info..."
                                            {...field}
                                            value={field.value || ''}
                                            onFocus={() => setIsFocused(true)}
                                            onBlur={() => setIsFocused(false)}
                                            style={{
                                                width: '100%',
                                                padding: '10px',
                                                borderRadius: '4px',
                                                border: isFocused ? '2px solid #1976d2' : '1px solid #ccc',
                                                fontSize: '1rem',
                                                lineHeight: '1.5',
                                                color: '#495057',
                                                backgroundColor: '#fff',
                                                boxShadow: 'inset 0 1px 1px rgba(0, 0, 0, 0.075)',
                                                transition: 'border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s',
                                            }}
                                        />
                                    </>

                                )}
                            />
                            <br />

                            <Controller
                                name="valor"
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <TextField
                                        label="Valor"
                                        variant="outlined"
                                        {...field}
                                        value={field.value || ''}
                                    />
                                )}
                            />
                            <br />
                        </div>

                    </DialogContent>

                    <DialogActions>
                        <Button onClick={() => onClose(false)}>Cancelar</Button>
                        <Button type='submit' disabled={!isValid}>
                            {(!codCargoBonoProducto || +codCargoBonoProducto === 0) ? 'Crear Lote productos' : 'Editar Lote Productos'}
                        </Button>
                    </DialogActions>
                </form>
                <LoadingSpinnerScreen open={openLoadingSpinner} />
            </Dialog>
        </>
    )
}
