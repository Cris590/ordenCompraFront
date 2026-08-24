import React from "react";
import {
  CircularProgress,
  TextField,
} from "@mui/material";
import { IoSearchOutline } from "react-icons/io5";

interface ProductoScannerProps {
  codigo: string;
  buscandoProducto: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  onChange: (valor: string) => void;
}

export const ProductoScanner = ({
  codigo,
  buscandoProducto,
  inputRef,
  onChange,
}: ProductoScannerProps) => {
  return (
    <div className="my-5 flex items-center gap-2">
      <TextField
        inputRef={inputRef}
        label="Escanear código de producto"
        placeholder="14 dígitos"
        value={codigo}
        onChange={(event) => onChange(event.target.value)}
        disabled={buscandoProducto}
        inputProps={{
          maxLength: 14,
          inputMode: "numeric",
        }}
        fullWidth
        autoComplete="off"
        InputProps={{
          startAdornment: (
            <IoSearchOutline
              size={20}
              className="mr-2 text-slate-500"
            />
          ),
          endAdornment: buscandoProducto ? (
            <CircularProgress size={22} />
          ) : null,
        }}
        helperText={`${codigo.length}/14 · Al completar 14 dígitos se busca automáticamente`}
      />
    </div>
  );
};