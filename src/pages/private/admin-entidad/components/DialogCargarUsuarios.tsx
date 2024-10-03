import { Button, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import LoadingSpinnerScreen from '../../../../components/loadingSpinnerScreen/LoadingSpinnerScreen';
import { cargarUsuariosEntidad } from '../../../../actions/entidad/entidad';
import Swal from 'sweetalert2';
import { IoLocate } from 'react-icons/io5';

interface Props {
    openDialog: boolean;
    onClose: (actualizarCategorias: boolean) => void;
    codEntidad: number;
}

const indicacionesCarga = [
    'El archivo debe ser de tipo csv, separado por COMAS', 
    'Los encabezados deben ser en minúsculas y siempre deben ser los siguiente => nombre,cedula,email,cargo,lote,sexo,activo,password ( En ese mismo Orden )',
    'Si carga elementos sin nombre, documento, cedula, cargo o email el usuario no se creara',
    'Usuarios que ya esten creados previamente no se podran crear nuevamente',
    'El nombre del cargo debe ser exactamente igual a los creados en la pestaña de cargos usuario, asi com su número de lote',
    'Para el sexo del usuario debe poner la letra M para másculino o la letra F para feminino',
    'El parametro activo deber ser 1 (Activo) o 0 (Inactivo)'
];

export const DialogCargarUsuarios = ({ codEntidad, openDialog, onClose }: Props) => {

    const [file, setFile] = useState<File | null>(null);
    const [openLoadingSpinner, setLoadingSpinner] = useState<boolean>(false)

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            setFile(files[0]);
        } else {
            console.error('No file selected');
        }
    };

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        const formData = new FormData();
        if (file) {
            formData.append('usuarios', file);
        }
        formData.append('cod_entidad', codEntidad.toString());

        setLoadingSpinner(true)
        let response = await cargarUsuariosEntidad(formData)
        setLoadingSpinner(false)

        if (response) {
            await Swal.fire(response.msg)
            onClose(true) 
        }


    };


    return (
        <>

            <Dialog
                open={openDialog}
                onClose={() => onClose(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth='lg'
            >
                <DialogTitle id="alert-dialog-title">
                    Cargar Usuarios
                </DialogTitle>

                <DialogContent>

                    <form onSubmit={handleSubmit}>
                        <input type="file" accept=".csv" onChange={handleFileChange} />
                        <Button type="submit" disabled={!file}>Cargar Archivo</Button>
                    </form>

                    <div className='mt-8'>
                    <p className='font-bold  text-center text-3xl text-gray-800'>Instrucciones de carga del archivo</p>
                    <List>
                        {indicacionesCarga.map((text, index) => (
                            <ListItem key={text}>
                                <ListItemIcon>
                                    <IoLocate /> 
                                </ListItemIcon>
                                <ListItemText primary={text} />
                            </ListItem>
                        ))}
                    </List>
                    </div>



                </DialogContent>

                <DialogActions>
                    <Button onClick={() => onClose(false)}>Cancelar</Button>
                </DialogActions>

                <LoadingSpinnerScreen open={openLoadingSpinner} />  
            </Dialog>
           
        </>
    )
}
