import React from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

import { IVendedorCrmTienda, Vendedor } from "../../../../../interfaces/pos.interface";

interface VendedorSectionProps {
  vendedores: IVendedorCrmTienda[];
  vendedor: IVendedorCrmTienda | null;
  onVendedorChange: (vendedorId: number) => void;
}

export const VendedorSection = ({
  vendedores,
  vendedor,
  onVendedorChange,
}: VendedorSectionProps) => {
  return (
    <FormControl
      size="small"
      className="w-full"
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
  );
};