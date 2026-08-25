import React from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

import { IVendedorCrmTienda, Vendedor } from "../../../../../interfaces/pos.interface";

interface VendedorSectionProps {
  vendedores: IVendedorCrmTienda[];
  vendedor: IVendedorCrmTienda | null;
  codigoNuevo: number,
  onVendedorChange: (vendedorId: number) => void;
}

export const VendedorSection = ({
  vendedores,
  vendedor,
  codigoNuevo,
  onVendedorChange,
}: VendedorSectionProps) => {
  return (
    <div className="flex items-center gap-3">
      <FormControl
        size="small"
        className="min-w-0 flex-1"
      >
        <InputLabel id="vendedor-label">
          Vendedor
        </InputLabel>

        <Select
          labelId="vendedor-label"
          value={vendedor?.id_usuario_crm ?? ""}
          label="Vendedor"
          onChange={(event) =>
            onVendedorChange(
              Number(event.target.value)
            )
          }
        >
          {vendedores.map((item) => (
            <MenuItem
              key={item.id_usuario_crm}
              value={item.id_usuario_crm}
            >
              {item.nombre}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="No. Registro"
        size="small"
        value={codigoNuevo}
        disabled
        className="min-w-0 flex-1"
      />
    </div>
  );
};