import React from 'react'
import { CartProducto } from '../../../../interfaces/cart.interface'
import { Card, CardContent, Typography } from '@mui/material'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { ColorCircle } from '../../../../components/product/color-circle/ColorCircle'

interface Props {
    producto:CartProducto
}
export const CardProducto = ({ producto}:Props) => {
  return (
    <Card sx={{ maxWidth: 250,minWidth:200 }} className='my-4 mx-4'>
        
        <LazyLoadImage
              src={producto.imagen}
              alt={producto.nombre}
              className="w-full object-cover rounded"
              width={200}
            //   height={300}
           
        />
        <CardContent>
            <Typography gutterBottom variant="subtitle1" component="div">
                {producto.nombre}
            </Typography>

            <p className='my-1 font-bold text-md'>{producto.categoria}</p>

            {
                (producto.tiene_talla === 1) && <p className='my-2'>Talla: {producto.talla} </p>
            }

            {
                (producto.tiene_color === 1) && <ColorCircle size='1' color={producto.color} />
            }
            
            <p className='my-3 font-semibold'>Cantidad: {producto.cantidad}</p>
        </CardContent>
    </Card>
  )
}
