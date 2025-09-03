import { Button, Dialog, DialogContent, DialogTitle, InputLabel, TextareaAutosize, TextField } from '@mui/material';
import React, { useState } from 'react'
import Swal from 'sweetalert2';
import LoadingSpinnerScreen from '../../../../components/loadingSpinnerScreen/LoadingSpinnerScreen';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { redimirBono } from '../../../../actions/entidad_bono/entidad_bono';
import { useUserStore } from '../../../../store/user/user';

interface Props {
    openDialog: boolean;
    onClose: (actualizarBono: boolean) => void;
    codUsuarioBonoEntrega: number;
}

interface IRedencionBono {
    comentario_cierre: string,
    cedula_vendedor: number,
    nombre_vendedor: string,
    tienda: string,
}

export const DialogConfirmarRedencion = ({ codUsuarioBonoEntrega, openDialog, onClose }: Props) => {
    const [openLoadingSpinner, setLoadingSpinner] = useState<boolean>(false)
    const [isFocused, setIsFocused] = useState(false);
    const { handleSubmit, reset, control, formState: { isValid }, watch } = useForm<IRedencionBono>({
        // defaultValues: defaulValueProducto
    });

    const session = useUserStore.getState().user

    const onSubmit: SubmitHandler<IRedencionBono> = async (data) => {


        Swal.fire({
            title: "¿Está seguro de redimir este bono?",
            text: "Esta acción es definitiva, no podrá redimirlo nuevamente!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, redimir bono!"
        }).then((result) => {
            if (result.isConfirmed) {
                const dataRedimir = {
                    ...data,
                    cod_usuario_bono_entrega: codUsuarioBonoEntrega
                };
                handleRedimir(dataRedimir);
            }
        });


    }


    const handleRedimir = async (dataRedimir: { comentario_cierre: string, cod_usuario_bono_entrega: number }) => {

        setLoadingSpinner(true);
        let data:any = {
            ...dataRedimir,
            cod_usuario: (session?.cod_usuario) ? session.cod_usuario : 0
        }
        const response = await redimirBono(data);
        setLoadingSpinner(false);
        if (response) {
            Swal.fire(response?.msg).then(() => {
                onClose(true)
            })
        }
    };





    return (
        <>
            <Dialog
                open={openDialog}
                onClose={() => onClose(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                PaperProps={{
                    style: {
                        width: '800px', // or any width you want
                        maxWidth: '90%', // optional: responsive behavior
                    },
                }}
            >
                <DialogContent>
                    <DialogTitle id="alert-dialog-title">
                        Redimir Bono
                    </DialogTitle>

                    <form onSubmit={handleSubmit(onSubmit)} >
                        <div className="flex flex-row gap-3 mt-4 items-end flex-wrap mb-5">
                            <Controller
                                name="cedula_vendedor"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        label="Cédula Vendedor"
                                        variant="outlined"
                                        required={true}
                                        {...field}
                                        value={field.value || ''}
                                    />
                                )}
                            />

                            <br />
                            <br />
                            <Controller
                                name="nombre_vendedor"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        label="Nombre del vendedor"
                                        variant="outlined"
                                        required={true}
                                        {...field}
                                        value={field.value || ''}
                                    />
                                )}
                            />

                            <br />
                            <br />
                            <Controller
                                name="tienda"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        label="Punto de venta"
                                        variant="outlined"
                                        required={true}
                                        {...field}
                                        value={field.value || ''}
                                    />
                                )}
                            />
                            <Controller
                                name="comentario_cierre"
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <>
                                        <InputLabel className='mt-4'>Comentario de cierre</InputLabel>
                                        <TextareaAutosize

                                            minRows={2}
                                            placeholder="..."
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


                            <br />
                        </div>
                        <Button disabled={!isValid} type='submit' variant='contained'>
                            Redimir Bono
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
            <LoadingSpinnerScreen open={openLoadingSpinner} />
        </>
    )
}
