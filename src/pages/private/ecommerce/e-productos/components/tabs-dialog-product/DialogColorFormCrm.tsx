import React, { useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    Typography
} from '@mui/material';
import { ChromePicker } from 'react-color';
import { Controller, useForm } from 'react-hook-form';
import { ICrearColorProductoCrm } from '../../../../../../interfaces/ecommerce.interface';

interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: ICrearColorProductoCrm) => void;
    colorInicial?: ICrearColorProductoCrm;
}

export const DialogColorFormCrm = ({
    open,
    onClose,
    onSubmit,
    colorInicial
}: Props) => {

    const {
        control,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: {
            errors,
            isValid
        }
    } = useForm<ICrearColorProductoCrm>({
        defaultValues: {
            cod_producto_color: undefined,
            codigo_color: '',
            nombre_color: '',
            color: '#ffffff',
        }
    });


    useEffect(() => {
        if (colorInicial) {
            reset({
                cod_producto_color: colorInicial.cod_producto_color,
                codigo_color: colorInicial.codigo_color,
                nombre_color: colorInicial.nombre_color,
                color: colorInicial.color,
            });
        } else {
            reset({
                cod_producto_color: undefined,
                codigo_color: '',
                nombre_color: '',
                color: '#ffffff',
            });
        }

    }, [colorInicial, reset]);


    const submit = (data: ICrearColorProductoCrm) => {
        onSubmit({
            ...data,
            codigo_color: data.codigo_color.toUpperCase()
        });

        onClose();
    };


    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle>
                {colorInicial?.cod_producto_color ? "Editar color" : "Crear color"}
            </DialogTitle>

            <DialogContent>
                <Box
                    sx={{
                        display: "flex",
                        gap: 4,
                        mt: 2,
                        alignItems: "center"
                    }}
                >

                    {/* Selector de color */}
                    <Box>
                        <Typography
                            variant="subtitle2"
                            sx={{ mb: 1 }}
                        >
                            Seleccionar color
                        </Typography>

                        {/* Selector de color */}
                    <Box>
                        <Typography
                            variant="subtitle2"
                            sx={{ mb: 1 }}
                        >
                            Seleccionar color
                        </Typography>

                        <Controller
                            name="color"
                            control={control}
                            render={({ field }) => (
                                <ChromePicker
                                    color={field.value || "#ffffff"}
                                    onChange={(color) => {
                                        field.onChange(color.hex);
                                    }}
                                />
                            )}
                        />


                    </Box>


                    </Box>


                    {/* Campos */}
                    <Box
                        sx={{
                            flex: 1
                        }}
                    >

                        <Controller
                            name="nombre_color"
                            control={control}
                            rules={{
                                required: "El nombre es obligatorio"
                            }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Nombre del color"
                                    fullWidth
                                    margin="normal"
                                    error={!!errors.nombre_color}
                                    helperText={
                                        errors.nombre_color?.message
                                    }
                                />
                            )}
                        />


                        <Controller
                            name="codigo_color"
                            control={control}
                            rules={{
                                required: "El código es obligatorio",
                                minLength: {
                                    value: 2,
                                    message: "Debe tener 2 caracteres"
                                },
                                maxLength: {
                                    value: 2,
                                    message: "Debe tener máximo 2 caracteres"
                                }
                            }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Código color"
                                    fullWidth
                                    margin="normal"
                                    inputProps={{
                                        maxLength: 2
                                    }}
                                    error={!!errors.codigo_color}
                                    helperText={
                                        errors.codigo_color?.message
                                    }
                                    onChange={(e) => {
                                        field.onChange(
                                            e.target.value
                                                .toUpperCase()
                                                .replace(/\s/g, "")
                                        );
                                    }}
                                />
                            )}
                        />


                        {/* Preview */}
                        <Box
                            sx={{
                                mt: 2,
                                display: "flex",
                                alignItems: "center",
                                gap: 1
                            }}
                        >
                            <Box
                                sx={{
                                    width: 30,
                                    height: 30,
                                    borderRadius: "50%",
                                    backgroundColor: watch("color"),
                                    border: "1px solid #ccc"
                                }}
                            />

                            <Typography variant="body2">
                                {watch("color")}
                            </Typography>
                        </Box>

                    </Box>

                </Box>

            </DialogContent>


            <DialogActions>
                <Button onClick={onClose}>
                    Cancelar
                </Button>

                <Button
                    variant="contained"
                    disabled={!isValid}
                    onClick={handleSubmit(submit)}
                >
                    {colorInicial?.cod_producto_color
                        ? "Guardar cambios"
                        : "Crear color"}
                </Button>
            </DialogActions>

        </Dialog>
    );
};