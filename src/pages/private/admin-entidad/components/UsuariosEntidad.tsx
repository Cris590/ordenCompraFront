
import React, { useState } from 'react'
import { Button } from '@mui/material'
import { DialogCargarUsuarios } from './DialogCargarUsuarios';
import { DataTableUsuarios } from './DataTableUsuarios';
interface Props {
    codEntidad: string
}

export const UsuariosEntidad = ({ codEntidad }: Props) => {

    const [open, setOpen] = useState(false);
    const [mostrarCargaMasiva, setMostrarCargaMasiva] = useState(true);
    const [refreshUsuarios, setRefreshUsuarios] = useState(false);
   
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (actualizarUsuarios: boolean) => {
        if(actualizarUsuarios){
            setRefreshUsuarios(!refreshUsuarios)
        }
        setOpen(false);
    };


    return (
        <>
        { mostrarCargaMasiva &&    <Button type="button" onClick={handleClickOpen}>Cargar Usuarios</Button> }
            <DataTableUsuarios 
                codEntidad={codEntidad}  
                refreshUsuarios={refreshUsuarios}
                sendTotalUsuarios = {(total)=>{setMostrarCargaMasiva(total === 0)}}
            />
            <DialogCargarUsuarios
                openDialog={open}
                onClose={handleClose}
                codEntidad={+codEntidad}
            />

            
        </>
    )
}
