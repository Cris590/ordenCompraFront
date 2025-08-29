import React, { useState } from 'react'
import { DepositosContenedor } from './components/DepositosContenedor'
import LoadingSpinnerScreen from '../../../components/loadingSpinnerScreen/LoadingSpinnerScreen'
import { DepositosMovimientos } from './components/DepositosMovimientos'

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
