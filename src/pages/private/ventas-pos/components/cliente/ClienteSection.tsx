import React, { useState } from "react";
import {
    Button,
    TextField,
} from "@mui/material";
import { IoPersonAddOutline } from "react-icons/io5";

import { Cliente, IClienteCrm } from "../../../../../interfaces/pos.interface";
import { DialogClientePos } from "../../../clientes-pos/components/DialogClientePos";

interface ClienteSectionProps {
    documento: string;
    cliente: Cliente | null;
    onDocumentoChange: (documento: string) => void;
    onDocumentoBlur: (documento:string) => void;
    onCrearCliente: () => void;
    documentoRef: React.RefObject<HTMLInputElement>;
}



const clienteNuevo: IClienteCrm = {
    id: 0,
    nombre: "",
    id_tipo_documento: 0,
    documento: "",
    dv: 0,
    email: "",
    telefono: "",
    direccion: "",
    fecha_nacimiento: "",
    compras: 0,
    ultima_compra: "",
    fecha: "",
    id_tienda: 0,
    origen: "",
    id_usuario: 0,
}


export const ClienteSection = ({
    documento,
    cliente,
    onDocumentoChange,
    onDocumentoBlur,
    
    documentoRef
}: ClienteSectionProps) => {
    const [openEditCliente, setOpenEditCliente] = useState(false);
    const [clienteEditar, setClienteEditar] = useState<IClienteCrm>(clienteNuevo)

    
  const handleCloseEditCliente = (actualizarCliente: boolean, documentoPos?:string) => {
   
    if(actualizarCliente && documentoPos){
      onDocumentoChange(documentoPos)
     onDocumentoBlur(documentoPos)
      
    }
    setOpenEditCliente(false);
  };

  const handleOnCrearCliente =()=>{
    setClienteEditar({...clienteNuevo, documento:documento})
    setOpenEditCliente(true)
  }
    return (
        <>


            <div className="flex min-w-0 items-end gap-2">
                <TextField
                    inputRef={documentoRef}
                    label="Documento"
                    size="small"
                    value={documento}
                    onChange={(event) =>onDocumentoChange(event.target.value)}
                    onBlur={(event) =>onDocumentoBlur(event.target.value)}
                    inputProps={{
                        inputMode: "numeric",
                    }}
                    autoComplete="off"
                    className="w-[180px] shrink-0"
                />
                <TextField
                    label="DV"
                    size="small"
                    value={cliente?.dv ?? ""}
                    disabled
                    className="w-[50px] shrink-0"
                />

                <TextField
                    label="Nombre del cliente"
                    size="small"
                    value={cliente?.nombre ?? ""}
                    disabled
                    className="min-w-0 flex-1"
                />

                
                <Button
                    variant="outlined"
                    onClick={handleOnCrearCliente}
                    disabled={!!cliente?.nombre && cliente?.nombre.length > 0}
                    className="!min-w-0 !h-[40px]"
                    title="Crear cliente"
                >
                    <IoPersonAddOutline size={20} />
                </Button>
            </div>

            <DialogClientePos
                openDialog={openEditCliente}
                onClose={handleCloseEditCliente}
                cliente={clienteEditar}
            />
        </>
    );
};