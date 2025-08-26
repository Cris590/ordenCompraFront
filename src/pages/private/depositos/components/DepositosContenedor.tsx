import React from 'react'
import { IDepositoInfo } from '../../../../interfaces/deposito.interface'
import { DepositoButton } from './DepositoButton'
import { Accordion, AccordionDetails, AccordionSummary, IconButton, Tooltip, Typography } from '@mui/material'
import { IoAddCircleSharp, IoChevronUp, IoRepeatSharp } from 'react-icons/io5'

export const DepositosContenedor = () => {
    const depositos: IDepositoInfo[] = [
        {
            cod_deposito: 1,
            no_cuenta: '90154512',
            valor: 2112135,
            nombre: 'Davivienda'
        },
        {
            cod_deposito: 2,
            no_cuenta: '154212',
            valor: 1000000,
            nombre: 'Bancolombia'
        },
        {
            cod_deposito: 3,
            no_cuenta: '12151',
            valor: 15002315,
            nombre: 'Caja social'
        }
    ]

    const handleVerInfoDeposito = (cod_deposito: number) => {
        console.log('HOLA ', cod_deposito)
    }

    return (

       
            <div className='w-full flex align-middle justify-center mx-auto container mt-3 mb-4'>

                <Accordion defaultExpanded className='w-full'>
                    <AccordionSummary
                        expandIcon={<IoChevronUp />}
                        aria-controls="panel1-content"
                        id="panel1-header"
                    >
                        <Typography component="span">Depósitos disponibles</Typography>
                    </AccordionSummary>
                    <AccordionDetails>



                        <div className='flex flex-row'>
                            <div className="flex flex-row overflow-x-auto max-w-full">
                                {depositos.map((deposito) => {
                                    return (<DepositoButton key={deposito.cod_deposito} deposito={deposito} handleVerInfoDeposito={handleVerInfoDeposito} />)
                                })}
                            </div>
                            <div className='mt-10'>
                                <Tooltip title="crear Deposito">
                                    <IconButton>
                                        <IoAddCircleSharp size={60} />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Transferir entre bolsillos" className='ms-3'>
                                    <IconButton color='secondary'>
                                        <IoRepeatSharp size={60} />
                                    </IconButton>
                                </Tooltip>
                            </div>
                        </div>

                    </AccordionDetails>
                </Accordion>
            </div>
      


    )
}
