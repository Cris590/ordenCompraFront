
import React, { useEffect, useState } from 'react'
import { crearCategoriaCRM, crearSubCategoriaCRM, editarCategoriaCRM, editarSubCategoriaCRM, sincronizarCategoriaEcommerce, sincronizarSubCategoriaEcommerce } from '../../../../../actions/ecommerce/ecommerce';
import Swal from 'sweetalert2';
import { Button, DialogActions, DialogContent, DialogTitle, TextField, Dialog } from '@mui/material';
import { ISubCategoriaCrm } from '../../../../../interfaces/ecommerce.interface';
import LoadingSpinnerScreen from '../../../../../components/loadingSpinnerScreen/LoadingSpinnerScreen';


interface Props {
    open: boolean;
    onClose: () => void;
    subcategoria: ISubCategoriaCrm
}

export const DialogSubCategoria = ({ open, onClose, subcategoria }: Props) => {

    useEffect(() => {
        setSubCategoriaNombre(subcategoria.sub_categoria)
    }, [subcategoria])

    const [openLoadingSpinner, setLoadingSpinner] = useState<boolean>(false)
    const [subCategoriaNombre, setSubCategoriaNombre] = useState('');

    const crearSubCategoria = async () => {
        const { isConfirmed, value } = await Swal.fire({
            title: 'Crear Sub-Categoría',
            html: `
                <div style="text-align:left;padding-top:8px">
                <label style="
                    display:flex;
                    align-items:center;
                    gap:10px;
                    font-size:15px;
                    cursor:pointer;
                ">
                    <input
                    id="sync-ecommerce"
                    type="checkbox"
                    checked
                    style="width:18px;height:18px;"
                    />
                    <span>Sincronizar automáticamente con el E-commerce</span>
                </label>

                <p style="
                    margin-top:12px;
                    color:#6c757d;
                    font-size:13px;
                ">
                    Si desmarcas esta opción, la Sub-Categoria se creará únicamente en el CRM.
                </p>
                </div>
            `,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Crear Sub-Categoria',
            cancelButtonText: 'Cancelar',
            focusConfirm: false,
            preConfirm: () => ({
                sincronizar: (
                    document.getElementById("sync-ecommerce") as HTMLInputElement
                ).checked,
            }),
        });

        if (!isConfirmed) return;

        const response = await crearSubCategoriaCRM({ id_categoria: subcategoria.id_categoria, sub_categoria: subCategoriaNombre });

        if (response) {

            if (value.sincronizar) {
                await sincronizarSubCategoriaEcommerce(response.id);
            }
            Swal.fire(response?.msg);
        } else {
            Swal.fire({
                icon: 'error',
                text: 'Error al crear la Sub-Categoria, intente nuevamente y si la novedad persiste comuniquese con el administrador.'
            });
        }

    }

    const actualizarSubCategoria = async () => {

        try {
            if (subcategoria.id) {
                const response = await editarSubCategoriaCRM(subcategoria.id, { sub_categoria: subCategoriaNombre });
                Swal.fire(response!.msg);
            }

        } catch (e) {
            Swal.fire({
                icon: 'error',
                text: 'Error al editar la categoria, intente nuevamente y si la novedad persiste comuniquese con el administrador.'
            });
        }
    }

    const handleSubmit = async () => {
        setLoadingSpinner(true)
        if (subcategoria.id) {
            await actualizarSubCategoria()
        } else {
            await crearSubCategoria()
        }
        setLoadingSpinner(false)
        onClose();
    };
    return (
        <>


            <Dialog open={open} onClose={onClose}>
                <DialogContent>
                    <DialogTitle id="alert-dialog-title">
                        Control de Sub-Categorias
                    </DialogTitle>
                    <TextField
                        label="Categoria"
                        value={subCategoriaNombre}
                        onChange={(e) => setSubCategoriaNombre(e.target.value)}
                        fullWidth
                        margin="dense"
                    />

                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancelar</Button>
                    <Button onClick={handleSubmit}
                        disabled={subCategoriaNombre.length == 0}
                        color="primary" variant="contained">
                        {subcategoria?.id ? 'Editar Sub-Categoria' : 'Crear Sub-Categoria'}
                    </Button>
                </DialogActions>
            </Dialog>

            <LoadingSpinnerScreen open={openLoadingSpinner} />
        </>
    )
}
