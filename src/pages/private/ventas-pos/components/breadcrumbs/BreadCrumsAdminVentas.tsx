
import { Breadcrumbs, Typography } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'


export const BreadCrumsAdminVentas = () => {
    return (
        <div className='my-3'>
            <Breadcrumbs aria-label="breadcrumb">
                <Link color="inherit" to="/admin_ventas">
                    Ver ventas
                </Link>

                <Typography color="text.primary">Crear-venta</Typography>
            </Breadcrumbs>
        </div>
    )
}
