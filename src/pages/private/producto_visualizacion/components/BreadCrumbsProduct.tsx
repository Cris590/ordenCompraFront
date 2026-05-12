

import React from 'react'
import { Link } from 'react-router-dom';
import { Breadcrumbs, Typography } from '@mui/material'

export const BreadCrumbsProduct = () => {

  return (
    <Breadcrumbs aria-label="breadcrumb">
        <Link color="inherit" to={`/catalogo`}>
          Catálogo
        </Link>
        
        <Typography color="text.primary">Detalle</Typography>
      </Breadcrumbs>
  )
}
