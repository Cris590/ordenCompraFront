import { Button, IconButton, Input, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { IoEye } from 'react-icons/io5'
import { ProductosCategoria } from './ProductosCategoria'

interface Props {
    codCategoria: number,
    categoria: string,
    cantidadDefecto:number,
    handleCantidadCategoria:(cod_categoria:number, cantidad:number)=>void
}

export const BotonProductoCategoria = ({
    codCategoria,
    categoria,
    cantidadDefecto,
    handleCantidadCategoria
}: Props) => {

    const [open, setOpen] = useState(false);
    const [cantidad, setCantidad] = useState(0);

    useEffect(() => {
      setCantidad(cantidadDefecto)
    }, [codCategoria])
    
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChangeCantidad = (event:any) =>{
        setCantidad(event.target.value)

        handleCantidadCategoria(codCategoria, event.target.value)
    }

    return (
        <>
            <div className='flex row justify-start items-center border-2 border-gray-100 mx-4 px-2 py-1 '>
                <Typography> {categoria} </Typography>

                <IconButton aria-label="delete" onClick={handleClickOpen}>
                    <IoEye />
                </IconButton>

                <Input className='w-20' type='number' value={cantidad} onChange={handleChangeCantidad} />
            </div>

            <ProductosCategoria 
                codCategoria={codCategoria}
                handleClose={handleClose}
                open={open}
                categoria={categoria}
            />

        </>
    )
}
