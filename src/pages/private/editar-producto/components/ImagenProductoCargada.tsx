import React, { useState } from 'react'
import { Dialog, DialogContent, IconButton } from '@mui/material';
import { IoCloseCircle } from 'react-icons/io5';

interface Props {
    url:string,
    cod_producto_color_imagen:number,
    borrarImagen:(imagenColor: {
        cod_producto_color_imagen:number,
        url:string
    }) => void
}
export const ImagenProductoCargada = ( { url, cod_producto_color_imagen, borrarImagen }:Props) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);
    const handleDialogClose = () => setIsDialogOpen(false);
    
    const handleImageClick = () => setIsDialogOpen(true);

    return (
        <div
        style={{ position: 'relative', display: 'inline-block' }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
    >
        <img
            src={url}
            alt={`Image ${cod_producto_color_imagen}`}
            style={{ width: '300px', cursor: 'pointer' }}
            onClick={handleImageClick}
        />
        {isHovered && (
            <IconButton
                onClick={()=>borrarImagen({cod_producto_color_imagen, url})}
                style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'rgba(0, 0, 0, 0.5)',
                    color: 'white',
                    borderRadius: '50%',
                    width: '30px',
                    height: '30px',
                    padding: '0',
                }}
            >
                <IoCloseCircle />
            </IconButton>
        )}
        <Dialog open={isDialogOpen} onClose={handleDialogClose} maxWidth="md" fullWidth>
            <DialogContent>
                <img src={url} alt={`Image ${cod_producto_color_imagen}`} style={{ width: '100%' }} />
            </DialogContent>
        </Dialog>
    </div>
    );
}
