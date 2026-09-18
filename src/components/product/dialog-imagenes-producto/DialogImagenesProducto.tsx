import React from 'react';
import {
    Dialog,
    DialogContent,
    IconButton,
    Typography
} from '@mui/material';
import { IoClose } from 'react-icons/io5';
import { ProductMobileSlideshow } from '../slideshow/ProductMobileSlideshow';
import { ProductSlideshow } from '../slideshow/ProductSlideshow';
import { ColorCircle } from '../color-circle/ColorCircle';


interface Props {
    images: string[];
    open: boolean;
    onClose: () => void;
    descripcion?: string;
    color?: string;
    nombreColor?: string;
    talla?: string;
}

export const DialogImagenesProducto = ({
    images,
    open,
    onClose,
    descripcion,
    color,
    nombreColor,
    talla
}: Props) => {

    if (!images.length) {
        return null;
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
        >
            <div className="flex items-center justify-between px-4 pt-3">

                <div>
                    {descripcion && (
                        <Typography fontWeight={700}>
                            {descripcion}
                        </Typography>
                    )}

                    {(color || nombreColor || talla) && (
                        <div className="flex items-center gap-2">

                            {color && (
                                <ColorCircle
                                    color={color}
                                    size="2"
                                />
                            )}

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                {nombreColor || '-'}
                                {talla && (
                                    <>
                                        {' · '}
                                        Talla {talla}
                                    </>
                                )}
                            </Typography>

                        </div>
                    )}
                </div>

                <IconButton onClick={onClose}>
                    <IoClose />
                </IconButton>

            </div>

            <DialogContent>

                <ProductMobileSlideshow
                    title={descripcion || ''}
                    images={images}
                    className="block md:hidden"
                />

                <ProductSlideshow
                    title={descripcion || ''}
                    images={images}
                    className="hidden md:block"
                />

            </DialogContent>
        </Dialog>
    );
};