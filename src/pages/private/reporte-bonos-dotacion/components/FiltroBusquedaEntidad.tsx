import React, { useEffect, useState } from 'react'
import { Accordion, AccordionDetails, AccordionSummary, Autocomplete, Button, TextField, Typography } from '@mui/material'
import { IoChevronUp } from 'react-icons/io5'
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { IEntidadTarjetaBono } from '../../../../interfaces/control_accesos.interface';
import { consultarEntidadesEntregaBono } from '../../../../actions/entidad_bono/entidad_bono';
import LoadingSpinnerScreen from '../../../../components/loadingSpinnerScreen/LoadingSpinnerScreen';

interface IEntidad {
    entidad:number
}
interface Props {
    handleBuscarFiltro: (filtro: IEntidad) => void
}

export const FiltroBusquedaEntidad = ({ handleBuscarFiltro }: Props) => {

    const [entidades, setEntidades] = useState<IEntidadTarjetaBono[]>([]);
    const [openLoadingSpinner, setOpenLoadingSpinner] = useState(false)


     useEffect(() => {
        obtenerUsuarios()
      }, [])
    
      const obtenerUsuarios = async () => {
        setOpenLoadingSpinner(true)
        let response = await consultarEntidadesEntregaBono()
        setOpenLoadingSpinner(false)
        if (response?.error == 0) {
          setEntidades(response.entidades)
        }
      }
      
    const {
        handleSubmit,
        reset,
        getValues,
        control,
        formState: { isValid } } = useForm<IEntidad>({
            mode: 'onChange',
        });

    const onSubmit: SubmitHandler<IEntidad> = async (data) => {
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
                    <Typography component="span">Busqueda de Entidad</Typography>
                </AccordionSummary>
                <AccordionDetails>

                    <div>
                        <form onSubmit={handleSubmit(onSubmit)}>

                            <div className="flex flex-row gap-4 mt-4 items-end flex-wrap mb-5">


                                <Controller
                                    name="entidad"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <Autocomplete
                                            sx={{ width: 500 }}
                                            options={entidades}
                                            getOptionLabel={(option) => option.nombre}

                                            // 🔹 Form → UI
                                            value={
                                                entidades.find(e => e.cod_entidad === field.value) || null
                                            }

                                            // 🔹 UI → Form
                                            onChange={(_, newValue) => {
                                                field.onChange(newValue?.cod_entidad || null);
                                            }}

                                            isOptionEqualToValue={(option, value) =>
                                                option.cod_entidad === value.cod_entidad
                                            }

                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Entidad"
                                                    placeholder="Buscar entidad"
                                                />
                                            )}
                                        />
                                    )}
                                />
                                
                            </div>
                            <br />
                            <div>
                                <Button disabled={!isValid} type='submit' variant='contained' className='mt-5 me-1' sx={{ mr: 1 }}>
                                    Obtener Reporte
                                </Button>
                                <Button type='button' variant='contained' color='warning' className='ms-1 mt-5' onClick={() => reset()}>
                                    Reiniciar filtro
                                </Button>
                            </div>


                        </form>
                    </div>
                </AccordionDetails>
            </Accordion>
            <LoadingSpinnerScreen open={openLoadingSpinner} />
        </div>
    )
}
