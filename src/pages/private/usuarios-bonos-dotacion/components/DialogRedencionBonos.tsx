
import React, { useEffect, useState } from 'react'
import LoadingSpinnerScreen from '../../../../components/loadingSpinnerScreen/LoadingSpinnerScreen'
import {  Dialog,  DialogContent, DialogTitle } from '@mui/material'
import Swal from 'sweetalert2';
import { consultarBonoProducto } from '../../../../actions/entidad_bono/entidad_bono';
import { IBonoProductoUsuario } from '../../../../interfaces/entidad_bonos.interface';
import { CardBono } from './CardBono';

interface Props {
    openDialog: boolean;
    onClose: (actualizarUsuario: boolean) => void;
    codUsuario: number;
}


export const DialogRedencionBonos = ({ codUsuario, openDialog, onClose }: Props) => {
    const [openLoadingSpinner, setLoadingSpinner] = useState<boolean>(false)
    const [bonosProductos, setBonosProductos] = useState<IBonoProductoUsuario[]>([]);
    useEffect(() => {
        setBonosProductos([])
        if (codUsuario && +codUsuario !== 0) {
            obtenerInfoBonoProducto(codUsuario)
        }
    }, [codUsuario, openDialog])

    const obtenerInfoBonoProducto = async (codUsuario: number) => {
        try {
            setLoadingSpinner(true)
            let response = await consultarBonoProducto(codUsuario)
            setLoadingSpinner(false)
            if (response?.error === 0) {
                setBonosProductos(response.bonos)
            } else if (response?.error === 1) {
                Swal.fire(response.msg)
            }
        } catch (e) {
            setLoadingSpinner(false)
        }

    }


    const handleActualizarBonosUsuario = (actualizar:boolean) => {
        if(actualizar) obtenerInfoBonoProducto(codUsuario)
    }
    return (
        <>
            <Dialog
                open={openDialog}
                onClose={() => onClose(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                PaperProps={{
                    style: {
                        width: '800px', // or any width you want
                        maxWidth: '90%', // optional: responsive behavior
                    },
                }}
            >
                <DialogContent>
                    <DialogTitle id="alert-dialog-title">
                        Redención de bonos
                    </DialogTitle>
                    {bonosProductos.map((bono) => (<CardBono 
                        key={bono.cod_usuario_bono_entrega} 
                        bonoProducto={bono} 
                        actualizarBonosUsuario = {handleActualizarBonosUsuario}
                    />))}
                </DialogContent>
            </Dialog>
            <LoadingSpinnerScreen open={openLoadingSpinner} />
        </>
    )
}

