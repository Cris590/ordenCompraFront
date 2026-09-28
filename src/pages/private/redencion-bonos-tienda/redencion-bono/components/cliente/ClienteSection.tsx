import React, { useState } from "react";
import {
    Button,
    TextField,
} from "@mui/material";

interface ClienteSectionProps {
    documento: string;
    nombre_cliente: string
}

export const ClienteSectionBono = ({ documento, nombre_cliente }: ClienteSectionProps) => {

    return (
        <>


            <div className="flex min-w-0 items-end gap-2">
                <TextField
                    
                    label="Documento"
                    size="small"
                    disabled
                    value={documento}
                    inputProps={{
                        inputMode: "numeric",
                    }}
                    autoComplete="off"
                    className="w-[180px] shrink-0"
                />
               
                <TextField
                    label="Nombre del cliente"
                    size="small"
                    value={nombre_cliente}
                    disabled
                    className="min-w-0 flex-1"
                />

            </div>
        </>
    );
};