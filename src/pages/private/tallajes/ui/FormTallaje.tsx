import React, { ChangeEvent, useEffect, useState } from 'react'

import {
    Button,
    Checkbox,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Input
} from '@mui/material';
import Swal from 'sweetalert2';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { ITallajeResumen } from '../../../../interfaces/tallaje.interface';
import { ImagenTallajeCargada } from './ImagenTallajeCargado';
import { crearTallaje, editarTallaje } from '../../../../actions/tallaje/tallaje';
import LoadingSpinnerScreen from '../../../../components/loadingSpinnerScreen/LoadingSpinnerScreen';

interface Props {
    openDialog: boolean;
    onClose: (actualizarTallajes: boolean) => void;
    tallaje: ITallajeResumen;
}


export const FormTallaje = ({ tallaje, openDialog, onClose }: Props) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [openLoadingSpinner, setLoadingSpinner] = useState<boolean>(false)
    const { handleSubmit, reset, control, formState: { isValid } } = useForm<ITallajeResumen>({
        defaultValues: tallaje
    });

    useEffect(() => {
        setSelectedFile(null)
        reset({
            nombre: tallaje.nombre,
            activo: tallaje.activo
        })
    }, [tallaje, openDialog])

    // ACCIONES IMAGENES

    const handleFileChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {

        if (event.target instanceof HTMLInputElement) {
            const file = event.target.files?.[0] || null; // Safely access the file
            setSelectedFile(file);
        }
    };

    const onSubmit: SubmitHandler<any> = async (data) => {
        const formData = new FormData();
        formData.append('nombre', data.nombre);
        formData.append('activo', data.activo.toString());

        if (data.imagen) {
            formData.append('imagen', selectedFile || ''); // Envía el archivo con la clave 'imagen'
        }

        if (tallaje.cod_tallaje) {
            updateTallaje(formData)
        } else {
            createTallaje(formData)
        }
    }

    const createTallaje = async (data: any) => {
        try {
            setLoadingSpinner(true)
            let res = await crearTallaje(data)
            setLoadingSpinner(false)
            if (res) {
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

    const updateTallaje = async (data: any) => {
        try {
            setLoadingSpinner(true)
            let res = await editarTallaje(data, tallaje.cod_tallaje)
            setLoadingSpinner(false)
            if (res) {
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
            >
                <DialogTitle id="alert-dialog-title">
                    {tallaje.cod_tallaje ? 'Editar Tallaje' : 'Crear Tallaje'}
                </DialogTitle>
                <form onSubmit={handleSubmit(onSubmit)} >
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


                            <Controller
                                name="activo"
                                control={control}
                                rules={{ required: true }}
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
                                name="imagen"
                                control={control}
                                rules={{ required: !tallaje.cod_tallaje }}
                                render={({ field }) => (
                                    <label htmlFor="file-upload" className="mx-3 mt-4">
                                        <Button variant="outlined" component="span">
                                            Escoger Imagen
                                            <Input
                                                id="file-upload"
                                                type="file"
                                                inputProps={{ accept: 'image/*' }}
                                                onChange={(e) => {
                                                    if (e.target instanceof HTMLInputElement) {
                                                        handleFileChange(e);
                                                        field.onChange(e.target.files); // Update the form state with the selected file(s)
                                                    }
                                                }}
                                                style={{ display: 'none' }}
                                            />
                                        </Button>
                                        {selectedFile && (
                                            <span className="mx-1">
                                                {selectedFile.name}
                                            </span>
                                        )}
                                    </label>
                                )}
                            />
                        </div>

                    </DialogContent>

                    {
                        tallaje.imagen && (
                            <ImagenTallajeCargada url={tallaje.imagen} />
                        )
                    }


                    <DialogActions>
                        <Button onClick={() => onClose(false)}>Cancelar</Button>
                        <Button disabled={!isValid} type='submit'>
                            {tallaje.cod_tallaje ? 'Editar Tallaje' : 'Crear Tallaje'}
                        </Button>
                    </DialogActions>
                </form>
                <LoadingSpinnerScreen open={openLoadingSpinner} />
            </Dialog>
           
        </>
    )
}
