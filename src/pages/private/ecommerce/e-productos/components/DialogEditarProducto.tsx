import React, { useEffect, useState } from 'react'
import { Button, DialogActions, DialogContent, Dialog, Box, Tab } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { TabResumenProducto } from './tabs-dialog-product/TabResumenProducto';
import { StepsConfiguracionProducto } from './tabs-dialog-product/StepsConfiguracionProducto';
import { useProductoEdicionStore } from '../../../../../store/ecommerce/producto-edicion';



interface Props {
    open: boolean;
    onClose: (actualizar:boolean) => void;
}

export const DialogEditarProducto = ({ open, onClose }: Props) => {

   
    const [value, setValue] = React.useState('1');
     /** Store producto */
    const producto = useProductoEdicionStore((state) => state.producto)
    
    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    useEffect(() => {
        setValue(producto.nuevo_producto ? "2" : "1");
    }, []);

    const handleClose = (
        event: {},
        reason: "backdropClick" | "escapeKeyDown"
    ) => {
        if (reason === "backdropClick") {
            return;
        }
        onClose(false);
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
                fullWidth
                disableEscapeKeyDown
                maxWidth={false}
                PaperProps={{
                    sx: {
                        width: "95vw",
                        height: "90vh",
                        borderRadius: 2,
                    }
                }}>
                <DialogContent>

                    <Box sx={{ width: '100%', typography: 'body1' }}>
                        <TabContext value={value}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <TabList onChange={handleChange} aria-label="lab API tabs example">
                                    {!producto.nuevo_producto && 
                                        <Tab label="Resumen" value="1" />
                                    }
                                    <Tab label="Configuración" value="2" />

                                </TabList>
                            </Box>
                            {!producto.nuevo_producto && 
                                <TabPanel value="1">
                                    <TabResumenProducto/>
                                </TabPanel>
                            }
                            <TabPanel value="2">
                                <StepsConfiguracionProducto onClose={(actualizar)=>onClose(actualizar)}/>
                            </TabPanel>
                        </TabContext>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={()=>onClose(false)}>Cancelar</Button>

                </DialogActions>
            </Dialog>

        </>
    )
}
