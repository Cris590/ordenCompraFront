import React, { useEffect, useState } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import { ChromePicker } from 'react-color';

interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: { 
        color_descripcion: string,
        color: string,
        cod_producto_color:number
     }) => void;
    colorInicial?:{
        cod_producto_color:number,
        color_descripcion: string, 
        color: string
    }
}

export const DialogColorForm = ({ open, onClose, onSubmit, colorInicial }: Props) => {
    const [colorDescripcion, setColorDescripcion] = useState('');
    const [color, setColor] = useState<string>('#ffffff');

    useEffect(() => {
        if(colorInicial){
            setColorDescripcion(colorInicial?.color_descripcion)
            setColor(colorInicial.color)
        }
    }, [colorInicial])
    

    const handleColorChange = (color: any) => {
        setColor(color.hex);
    };

    const handleSubmit = () => {
        onSubmit({ 
            color_descripcion: colorDescripcion, 
            color, 
            cod_producto_color:colorInicial?.cod_producto_color || 0 
        });
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Escoge un color</DialogTitle>
            <DialogContent>
                <ChromePicker color={color} onChange={handleColorChange} />
                <TextField
                    label="Color Description"
                    value={colorDescripcion}
                    onChange={(e) => setColorDescripcion(e.target.value)}
                    fullWidth
                    margin="dense"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button onClick={handleSubmit} color="primary" variant="contained">
                   {colorInicial?.cod_producto_color ? 'Editar Color':'Crear Color'}  
                </Button>
            </DialogActions>
        </Dialog>
    )
}
