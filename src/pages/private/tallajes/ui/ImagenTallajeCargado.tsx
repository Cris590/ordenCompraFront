import React, { useState } from 'react'
import { Dialog, DialogContent, IconButton } from '@mui/material';
import { IoCloseCircle } from 'react-icons/io5';

interface Props {
    url:string,
}
export const ImagenTallajeCargada = ( { url }:Props) => {
    
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const handleDialogClose = () => setIsDialogOpen(false);
    const handleImageClick = () => setIsDialogOpen(true);


    return (
        <div
        style={{ position: 'relative', display: 'inline-block' }}
    >
        <img
            src={url}
            alt={`Image`}
            style={{ width: '300px', cursor: 'pointer' }}
            onClick={handleImageClick}
        />
        
        <Dialog open={isDialogOpen} onClose={handleDialogClose} maxWidth="md" fullWidth>
            <DialogContent>
                <img src={url} alt={`Imagen`} style={{ width: '100%' }} />
            </DialogContent>
        </Dialog>
    </div>
    );
}
