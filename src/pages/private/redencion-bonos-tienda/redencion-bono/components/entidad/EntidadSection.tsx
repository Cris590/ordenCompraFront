import React from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";


interface EntidadSectionProps {
 entidad:string,
 no_contrato:string
}

export const EntidadSection = ({
 entidad,
 no_contrato
}: EntidadSectionProps) => {
  return (
    <div className="flex items-center gap-3">
      
      <TextField
        label="Nombre Entidad"
        size="small"
        value={entidad}
        disabled
        className="min-w-0 flex-1"
      />

      <TextField
        label="No. Contrato"
        size="small"
        value={no_contrato}
        disabled
        className="min-w-0 flex-1"
      />
    </div>
  );
};