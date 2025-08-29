import { Accordion, AccordionDetails, AccordionSummary, Button, TextField, Typography } from '@mui/material'
import React from 'react'
import { IoChevronUp } from 'react-icons/io5'
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { IFiltroBonoBusqueda } from '../../../../interfaces/entidad_bonos.interface';

interface Props {
    handleBuscarFiltro: (filtro: IFiltroBonoBusqueda) => void
}

export const FiltroBusquedaBonos = ({ handleBuscarFiltro }: Props) => {

    const {
        handleSubmit,
        reset,
        getValues,
        control,
        formState: { isValid } } = useForm<IFiltroBonoBusqueda>({
            mode: 'onChange',
        });

    const onSubmit: SubmitHandler<IFiltroBonoBusqueda> = async (data) => {
        console.log('___ DATA SUBMITED __')
        console.log(data)

        handleBuscarFiltro(data)

    }

    return (
        <div className='m-3'>
            <Accordion defaultExpanded className='w-full'>
                <AccordionSummary
                    expandIcon={<IoChevronUp />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                >
                    <Typography component="span">Filtro Busqueda Bonos</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <div>
                            <form onSubmit={handleSubmit(onSubmit)}>

                                <div className="flex flex-row gap-4 mt-4 items-end flex-wrap mb-5">

                                    <Controller
                                        name="codigo"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                label="Código"
                                                variant="outlined"
                                                required={true}
                                                {...field}
                                                value={field.value || ''}
                                            />
                                        )}
                                    />
                                    <br />
                                    <Controller
                                        name="cedula"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                label="Cédula Beneficiario"
                                                variant="outlined"
                                                required={true}
                                                {...field}
                                                value={field.value || ''}
                                            />
                                        )}
                                    />
                                    <br />
                                    {/* <Controller
                                        name="nit"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                label="Nit Entidad"
                                                variant="outlined"
                                                {...field}
                                                value={field.value || ''}
                                            />
                                        )}
                                    />
                                    <br />
                                    <Controller
                                        name="no_contrato"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                label="No Contrato"
                                                variant="outlined"
                                                {...field}
                                                value={field.value || ''}
                                            />
                                        )}
                                    /> */}
                                    <br />

                                </div>
                                <div>
                                    <Button disabled={!isValid} type='submit' variant='contained' className='mt-5'>
                                        Filtrar informacion!
                                    </Button>
                                    <Button type='button' variant='contained' color='warning' className='ms-1 mt-5' onClick={()=>reset()}>
                                        Reiniciar filtro
                                    </Button>
                                </div>


                            </form>
                        </div>
                    </LocalizationProvider>
                </AccordionDetails>
            </Accordion>
        </div>
    )
}
