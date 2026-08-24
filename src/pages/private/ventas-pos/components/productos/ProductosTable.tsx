import React from "react";
import { IconButton } from "@mui/material";
import {
  IoAdd,
  IoRemove,
  IoTrashOutline,
} from "react-icons/io5";
import { ProductoVenta } from "../../../../../interfaces/pos.interface";


interface ProductosTableProps {
  productos: ProductoVenta[];
  onCambiarCantidad: (
    productoId: number,
    delta: number
  ) => void;
  onEliminarProducto: (productoId: number) => void;
  formatMoney: (value: number) => string;
}

export const ProductosTable = ({
  productos,
  onCambiarCantidad,
  onEliminarProducto,
  formatMoney,
}: ProductosTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[700px]">
        <thead>
          <tr className="border-b text-left text-sm text-slate-500">
            <th className="p-3">Producto</th>
            <th className="p-3">Código</th>
            <th className="p-3 text-center">Cantidad</th>
            <th className="p-3 text-right">Precio</th>
            <th className="p-3 text-right">Total</th>
            <th className="p-3"></th>
          </tr>
        </thead>

        <tbody>
          {productos.map((producto) => (
            <tr
              key={producto.id}
              className="border-b"
            >
              <td className="p-3">
                <div className="font-medium">
                  {producto.nombre}
                </div>

                <div className="text-xs text-slate-500">
                  Stock: {producto.stock}
                </div>
              </td>

              <td className="p-3 text-sm">
                {producto.codigo}
              </td>

              <td className="p-3">
                <div className="flex items-center justify-center gap-1">
                  <IconButton
                    size="small"
                    onClick={() =>onCambiarCantidad(producto.id,-1)
                    }
                  >
                    <IoRemove size={16} />
                  </IconButton>

                  <span className="min-w-8 text-center font-semibold">
                    {producto.cantidad}
                  </span>

                  <IconButton
                    size="small"
                    onClick={() =>onCambiarCantidad(producto.id,1)}
                  >
                    <IoAdd size={16} />
                  </IconButton>
                </div>
              </td>

              <td className="p-3 text-right">
                {formatMoney(producto.precio)}
              </td>

              <td className="p-3 text-right font-semibold">
                {formatMoney(
                  producto.precio *
                    producto.cantidad
                )}
              </td>

              <td className="p-3 text-right">
                <IconButton
                  color="error"
                  onClick={() =>
                    onEliminarProducto(
                      producto.id
                    )
                  }
                >
                  <IoTrashOutline size={20} />
                </IconButton>
              </td>
            </tr>
          ))}

          {productos.length === 0 && (
            <tr>
              <td
                colSpan={6}
                className="p-12 text-center text-slate-500"
              >
                Escanea un producto para comenzar.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};