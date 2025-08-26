import { Accordion, AccordionDetails, AccordionSummary, Button, Card, Typography } from '@mui/material'
import React, { useState } from 'react'
import { IBonoProductoUsuario } from '../../../../interfaces/entidad_bonos.interface'
import { currencyFormat } from '../../../../utils/currencyFormat'
import { DialogConfirmarRedencion } from './DialogConfirmarRedencion'
import { formatDate } from '../../../../utils/formatDate'
import { IoChevronUp } from 'react-icons/io5'

interface Props {
    bonoProducto: IBonoProductoUsuario,
    actualizarBonosUsuario: (actualizar:boolean) => void
}
export const CardBono = ({ bonoProducto, actualizarBonosUsuario }: Props) => {

    const handleRedimirBono = () => {
        setOpenDialogRedencion(true)
    }
    const [openDialogRedencion, setOpenDialogRedencion] = useState(false)


    const handleCloseDialogRedencion = (actualizar: boolean) => {
        setOpenDialogRedencion(false)
        actualizarBonosUsuario(actualizar)
    }

    return (

        <>

            <Accordion className='w-full mt-3'>
                <AccordionSummary
                    expandIcon={<IoChevronUp />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                >
                    <Button size='small' color={bonoProducto.redimido ? 'success' : 'primary' }>{bonoProducto.redimido ? 'Redimido' : 'Por redimir' }</Button>
                    <Typography component="span"> - { bonoProducto.nombre} </Typography>
                </AccordionSummary>
                <AccordionDetails>

                   
                        <div className='flex flex-row justify-between mt-5 p-5'>
                            <div className='w-[80%]'>
                                <Typography variant="body1" component="div">
                                    <span className='font-bold'> Nombre: </span>
                                    {bonoProducto.nombre}
                                </Typography>

                                <Typography variant="body1" component="div">
                                    <span className='font-bold'> Descripcion: </span>
                                </Typography>
                                <Typography
                                    variant="body1"
                                    component="textarea"
                                    value={bonoProducto.descripcion}
                                    readOnly
                                    style={{ width: '100%', minHeight: "250px", border: 'none', resize: 'none', background: 'transparent' }}
                                />

                                <Typography variant="body1" component="div">
                                    <span className='font-bold'>Valor: </span>
                                    {currencyFormat(bonoProducto.valor)}
                                </Typography>
                                <Typography variant="body1" component="div">
                                    <span className='font-bold'>Fecha Redimido: </span>
                                    {bonoProducto.fecha_redimido ? formatDate(bonoProducto.fecha_redimido) : 'Pendiente'}
                                </Typography>
                                <br />
                                <Typography variant="body2">
                                    <span className='font-bold'> Comentario de cierre: </span>
                                    {bonoProducto.comentario_cierre}

                                </Typography>
                                <br />
                            </div>
                            <div className='flex align-middle justify-center ms-6'>
                                <Button
                                    onClick={handleRedimirBono}
                                    variant='contained'
                                    disabled={bonoProducto.redimido}
                                    color={bonoProducto.redimido ? 'success' : 'primary'}
                                >
                                    {bonoProducto.redimido ? 'Bono redimido' : 'Redimir Bono'}
                                </Button>
                            </div>
                        </div>
                    

                </AccordionDetails>
            </Accordion>

            <DialogConfirmarRedencion
                codUsuarioBonoEntrega={bonoProducto.cod_usuario_bono_entrega}
                openDialog={openDialogRedencion}
                onClose={handleCloseDialogRedencion}
            />
        </>

    )
}
