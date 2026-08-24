import React, { useEffect, useState } from "react";
import {
  Checkbox,
  FormControlLabel,
  TextField,
} from "@mui/material";

interface DescuentoSectionProps {
  usarDescuento: boolean;
  descuento: number;
  onUsarDescuentoChange: (value: boolean) => void;
  onDescuentoChange: (value: number) => void;
}

export const DescuentoSection = ({
  usarDescuento,
  descuento,
  onUsarDescuentoChange,
  onDescuentoChange,
}: DescuentoSectionProps) => {

  const [descuentoInput, setDescuentoInput] = useState(
    descuento > 0 ? String(descuento) : ""
  );

  useEffect(() => {
    setDescuentoInput(
      descuento > 0 ? String(descuento) : ""
    );
  }, [descuento]);

  const handleDescuentoChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const valor = event.target.value;

    // Permitir vacío
    if (valor === "") {
      setDescuentoInput("");
      onDescuentoChange(0);
      return;
    }

    // Solo números
    if (!/^\d+$/.test(valor)) {
      return;
    }

    const numero = Math.min(
      100,
      Math.max(0, Number(valor))
    );

    setDescuentoInput(String(numero));
    onDescuentoChange(numero);
  };

  return (
    <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

      <FormControlLabel
        control={
          <Checkbox
            checked={usarDescuento}
            onChange={(event) =>
              onUsarDescuentoChange(event.target.checked)
            }
          />
        }
        label="Aplicar descuento"
      />

      {usarDescuento && (
        <TextField
          label="Descuento (%)"
          type="text"
          value={descuentoInput}
          onChange={handleDescuentoChange}
          size="small"
          className="w-full sm:w-40"
          inputProps={{
            inputMode: "numeric",
            maxLength: 3,
          }}
        />
      )}
    </div>
  );
};