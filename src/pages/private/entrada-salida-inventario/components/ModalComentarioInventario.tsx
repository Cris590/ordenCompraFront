import React, { useState } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from "@mui/material";

interface Props {
    open: boolean;
    loading?: boolean;
    onClose: () => void;
    onConfirm: (comentario: string) => void;
}

export const ModalComentarioInventario = ({
    open,
    loading = false,
    onClose,
    onConfirm,
}: Props) => {

    const [comentario, setComentario] = useState("");

    const handleClose = () => {

        if (loading) {
            return;
        }

        setComentario("");
        onClose();
    };

    const handleConfirm = () => {

        onConfirm(comentario.trim());
        setComentario("");
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="sm"
        >

            <DialogTitle>
                Confirmar movimiento de inventario
            </DialogTitle>

            <DialogContent>

                <TextField
                    fullWidth
                    multiline
                    minRows={4}
                    label="Comentario"
                    placeholder="Ingrese un comentario para este movimiento..."
                    value={comentario}
                    onChange={(e) =>setComentario(e.target.value)}
                    sx={{ mt: 1 }}
                    disabled={loading}
                />

            </DialogContent>

            <DialogActions>

                <Button
                    onClick={handleClose}
                    disabled={loading}
                >
                    Cancelar
                </Button>

                <Button
                    variant="contained"
                    color="success"
                    onClick={handleConfirm}
                    disabled={loading}
                >
                    {loading
                        ? "Guardando..."
                        : "Guardar"}
                </Button>

            </DialogActions>

        </Dialog>
    );
};