

import { Breadcrumbs, Typography } from '@mui/material'
import React from 'react'
import { useCartStore } from '../../../../store/cart/cart-store';
import { Link } from 'react-router-dom';

export const BreadCrumbsProduct = () => {

  const usuarioOrden = useCartStore((state)=>state.usuarioOrden)

  return (
    <Breadcrumbs aria-label="breadcrumb">
        <Link color="inherit" to={`/catalogo`}>
          Catálogo
        </Link>
        
        <Typography color="text.primary">Detalle</Typography>
      </Breadcrumbs>
  )
}
