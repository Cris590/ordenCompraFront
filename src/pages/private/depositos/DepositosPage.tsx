import React, { useState } from 'react'
import { DepositosContenedor } from './components/DepositosContenedor'
import { Accordion, AccordionDetails, Icon, IconButton, Tooltip, Typography, AccordionSummary } from '@mui/material'
import { IoAddCircleSharp, IoChevronUp, IoRepeatSharp } from 'react-icons/io5'
// import ExpandMoreIcon from 'react-icons/io5';
import LoadingSpinnerScreen from '../../../components/loadingSpinnerScreen/LoadingSpinnerScreen'
import { DepositosMovimientos } from './components/DepositosMovimientos'
import { FiltroMovimientos } from './components/FiltroMovimientos'

export const DepositosPage = () => {

  const [openLoadingSpinner, setOpenLoadingSpinner] = useState(false)
  return (
    <>
      <div className='m-6'>

        <DepositosContenedor />
        <DepositosMovimientos />
      </div>
      <LoadingSpinnerScreen open={openLoadingSpinner} />

    </>
  )
}
