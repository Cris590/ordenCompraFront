import React, { useEffect, useState } from 'react'
import { crearCategoriaCRM, editarCategoriaCRM, sincronizarCategoriaEcommerce } from '../../../../../actions/ecommerce/ecommerce';
import Swal from 'sweetalert2';
import { Button, DialogActions, DialogContent, DialogTitle, TextField, Dialog } from '@mui/material';
import { ICategoriaCrm } from '../../../../../interfaces/ecommerce.interface';
import LoadingSpinnerScreen from '../../../../../components/loadingSpinnerScreen/LoadingSpinnerScreen';



interface Props {
    open: boolean;
    onClose: () => void;
    categoria: ICategoriaCrm
}

export const DialogCategoria = ({ open, onClose, categoria }: Props) => {

    useEffect(() => {
        setCategoriaNombre(categoria.categoria)
    }, [categoria])

    const [categoriaNombre, setCategoriaNombre] = useState('');
    const [openLoadingSpinner, setLoadingSpinner] = useState<boolean>(false)

    const crearCategoria = async () => {
        const { isConfirmed, value } = await Swal.fire({
            title: 'Crear subcategoría',
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
                    Si desmarcas esta opción, la categoria se creará únicamente en el CRM.
                </p>
                </div>
            `,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Crear Categoria',
            cancelButtonText: 'Cancelar',
            focusConfirm: false,
            preConfirm: () => ({
                sincronizar: (
                    document.getElementById("sync-ecommerce") as HTMLInputElement
                ).checked,
            }),
        });

        if (!isConfirmed) return;

        const response = await crearCategoriaCRM({ categoria: categoriaNombre });

        if (response) {

            if (value.sincronizar) {
                await sincronizarCategoriaEcommerce(response.id);
            }
            Swal.fire(response?.msg);
        } else {
            Swal.fire({
                icon: 'error',
                text: 'Error al crear la categoria, intente nuevamente y si la novedad persiste comuniquese con el administrador.'
            });
        }

    }

    const actualizarCategoria = async () => {

        try {
            if (categoria.id) {
                const response = await editarCategoriaCRM(categoria.id, { categoria: categoriaNombre });
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
        if (categoria.id) {
            await actualizarCategoria()
        } else {
            await crearCategoria()
        }
        setLoadingSpinner(false)
        onClose();
    };
    return (
        <>
            <Dialog open={open} onClose={onClose}>
                <DialogContent>
                    <DialogTitle id="alert-dialog-title">
                        Control de categoria
                    </DialogTitle>
                    <TextField
                        label="Categoria"
                        value={categoriaNombre}
                        onChange={(e) => setCategoriaNombre(e.target.value)}
                        fullWidth
                        margin="dense"
                    />

                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancelar</Button>
                    <Button onClick={handleSubmit}
                        disabled={categoriaNombre.length == 0}
                        color="primary" variant="contained">
                        {categoria?.id ? 'Editar Categoria' : 'Crear Categoria'}
                    </Button>
                </DialogActions>
            </Dialog>
            <LoadingSpinnerScreen open={openLoadingSpinner} />
        </>
    )
}
