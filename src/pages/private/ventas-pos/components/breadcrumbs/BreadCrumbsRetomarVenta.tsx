import { Breadcrumbs, Typography } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'


export const BreadCrumbsRetomarVenta = () => {
  return (
    <div className='my-3'>
        <Breadcrumbs aria-label="breadcrumb">
            <Link color="inherit" to="/retomar_ventas">
            Retomar ventas
            </Link>
            
            <Typography color="text.primary">Retomar-ventas</Typography>
        </Breadcrumbs>
    </div>
  )
}
