import React from "react";
import {
  Card,
  CardContent,
  Typography,
} from "@mui/material";

import { ProductoVenta } from "../../../../../interfaces/pos.interface";

import { ProductoScanner } from "./ProductoScanner";
import { ProductosTable } from "./ProductosTable";

interface ProductosSectionProps {
  codigo: string;
  productos: ProductoVenta[];
  buscandoProducto: boolean;
  scannerRef: React.RefObject<HTMLInputElement>;

  onCodigoChange: (valor: string) => void;

  onCambiarCantidad: (
    productoId: number,
    delta: number
  ) => void;

  onEliminarProducto: (
    productoId: number
  ) => void;

  formatMoney: (value: number) => string;
}

export const ProductosSection = ({
  codigo,
  productos,
  buscandoProducto,
  scannerRef,
  onCodigoChange,
  onCambiarCantidad,
  onEliminarProducto,
  formatMoney,
}: ProductosSectionProps) => {
  return (
    <>
        <Typography
          variant="h6"
          fontWeight={700}
          className="mb-4"
        >
          Productos
        </Typography>

        <ProductoScanner
          codigo={codigo}
          buscandoProducto={buscandoProducto}
          inputRef={scannerRef}
          onChange={onCodigoChange}
        />

        <ProductosTable
          productos={productos}
          onCambiarCantidad={onCambiarCantidad}
          onEliminarProducto={onEliminarProducto}
          formatMoney={formatMoney}
        />
    </>
  );
};