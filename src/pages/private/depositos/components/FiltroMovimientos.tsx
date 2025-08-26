import { Accordion, AccordionDetails, AccordionSummary, Button, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import React from 'react'
import { IoChevronUp } from 'react-icons/io5'
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { IFiltroMovimientos } from '../../../../interfaces/deposito.interface';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';



export const FiltroMovimientos = () => {

    const {
        handleSubmit,
        reset,
        getValues,
        control,
        formState: { isValid } } = useForm<IFiltroMovimientos>({
            mode: 'onChange',
            defaultValues: {
                fecha_inicio: dayjs().startOf('month'),
                fecha_fin: dayjs()
            }
        });

    const onSubmit: SubmitHandler<IFiltroMovimientos> = async (data) => {
        console.log('_________  DATA SUBMITTED ______')
        console.log(data)

        const form = {
            ...data,
            fecha_inicio:data.fecha_inicio.format('YYYY-MM-DD HH:mm:ss'),
            fecha_fin:data.fecha_fin.format('YYYY-MM-DD 29:59:59')
        }

        console.log(form)

    }

    const conceptos = [{
        cod_concepto: 1,
        nombre: 'Abono Venta'
    }, {
        cod_concepto: 2,
        nombre: 'Abono Compra'
    }, {
        cod_concepto: 3,
        nombre: 'Transferencia Entre Deposito'
    }, {
        cod_concepto: 4,
        nombre: 'Caja Menor'
    }]

    return (
        <Accordion defaultExpanded className='w-full'>
            <AccordionSummary
                expandIcon={<IoChevronUp />}
                aria-controls="panel1-content"
                id="panel1-header"
            >
                <Typography component="span">Filtro</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <div>
                        <form onSubmit={handleSubmit(onSubmit)}>

                            <div className="flex flex-row gap-4 mt-4 items-end flex-wrap mb-5">
                                {/* Fecha Inicio */}
                                <div className="w-64">
                                    <Controller
                                        name="fecha_inicio"
                                        control={control}
                                        rules={{
                                            validate: (value) => {
                                                const end = getValues("fecha_fin");
                                                return (
                                                    !end ||
                                                    !value ||
                                                    dayjs(value).isBefore(dayjs(end)) ||
                                                    "La fecha de inicio debe ser menor o igual a la fecha final"
                                                );
                                            },
                                        }}
                                        render={({ field, fieldState }) => (
                                            <DatePicker
                                                label="Fecha Inicio"
                                                value={field.value ? dayjs(field.value) : null}
                                                onChange={(date) => field.onChange(date)}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        fullWidth
                                                        error={!!fieldState.error}
                                                        helperText={fieldState.error?.message}
                                                    />
                                                )}
                                            />
                                        )}
                                    />
                                </div>

                                {/* Fecha Fin */}
                                <div className="w-64">
                                    <Controller
                                        name="fecha_fin"
                                        control={control}
                                        rules={{
                                            validate: (value) => {
                                                const start = getValues("fecha_inicio");
                                                return (
                                                    !start ||
                                                    !value ||
                                                    dayjs(value).isAfter(dayjs(start)) ||
                                                    "La fecha final debe ser igual o posterior a la fecha de inicio"
                                                );
                                            },
                                        }}
                                        render={({ field, fieldState }) => (
                                            <DatePicker
                                                label="Fecha Final"
                                                value={field.value ? dayjs(field.value) : null}
                                                onChange={(date) => field.onChange(date)}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        fullWidth
                                                        error={!!fieldState.error}
                                                        helperText={fieldState.error?.message}
                                                    />
                                                )}
                                            />
                                        )}
                                    />
                                </div>

                                {/* Concepto */}
                                <div className="min-w-[200px]">
                                    <Controller
                                        name="cod_concepto"
                                        control={control}
                                        render={({ field }) => (
                                            <>
                                                <InputLabel id="concepto" className="mb-1">Concepto</InputLabel>
                                                <Select
                                                    labelId="concepto"
                                                    {...field}
                                                    fullWidth
                                                >
                                                    {conceptos.map((concepto) => (
                                                        <MenuItem key={concepto.cod_concepto} value={concepto.cod_concepto}>
                                                            {concepto.nombre}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </>
                                        )}
                                    />
                                </div>
                            </div>

                            <Button disabled={!isValid} type='submit' variant='contained' className='mt-5'>
                                Filtrar informacion!
                            </Button>

                        </form>
                    </div>
                </LocalizationProvider>
            </AccordionDetails>
        </Accordion>
    )
}
