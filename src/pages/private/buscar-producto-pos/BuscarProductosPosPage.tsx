import React, { useState } from "react";
import Swal from "sweetalert2";
import { Button, TextField } from "@mui/material";
import { IoSearchOutline } from "react-icons/io5";

import LoadingSpinnerScreen from "../../../components/loadingSpinnerScreen/LoadingSpinnerScreen";
import { Title } from "../../../components/title/Title";
import { useFilteredData } from "../../../hooks/useFilteredData";
import { buscarInventarioPorCodigo } from "../../../actions/pos/pos";
import { IInventarioProducto } from "../../../interfaces/pos.interface";
import { TableInventarios } from "../inventario-pos/components/TableInventarios";

export const BuscarProductosPosPage = () => {
  const [codigo, setCodigo] = useState("");
  const [openLoadingSpinner, setOpenLoadingSpinner] = useState(false);
  const [inventarios, setInventarios] = useState<IInventarioProducto[]>([]);
  const {
    search,
    setSearch,
    filteredData,
  } = useFilteredData(inventarios);

  const buscarInventarios = async () => {
    const codigoLimpio = codigo.trim();

    if (!codigoLimpio) {
      Swal.fire({
        icon: "warning",
        text: "Ingresa un código de producto.",
      });
      return;
    }

    try {
      setInventarios([]);
      setOpenLoadingSpinner(true);

      const response = await buscarInventarioPorCodigo(
        codigoLimpio
      );

      if (response?.error === 0 && response?.inventarios) {
        setInventarios(response.inventarios);
        setSearch("");
      } else {
        setInventarios([]);

        Swal.fire(response!.msg);
      }

    } catch (error) {
      Swal.fire({
        icon: "error",
        text: "Error al consultar el producto. Contacte al administrador.",
      });
    } finally {
      setOpenLoadingSpinner(false);
    }
  };

  return (
    <>
      <Title title="Buscar productos" />

      <div className="min-h-screen bg-slate-100 p-3">

        {/* BUSCADOR */}

        <div className="rounded-lg border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="text-lg font-semibold text-slate-700">
              Consulta de inventario
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Busca un producto por su código para consultar
              su inventario por bodega.
            </p>
          </div>

          <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center">

            <TextField
              size="small"
              label="Código de producto"
              placeholder="Escanee el código"
              value={codigo}
              onChange={(e) => {
                const valor = e.target.value.replace(/\D/g, "");
                if (valor.length <= 14) {setCodigo(valor);}
              }}
            
              inputProps={{
                maxLength: 14,
                inputMode: "numeric",
              }}
              sx={{
                width: 280,
              }}
              autoFocus
            />

            <Button
              variant="contained"
              startIcon={<IoSearchOutline />}
              onClick={buscarInventarios}
              className="h-10 sm:min-w-[120px]"
            >
              Buscar
            </Button>

          </div>
        </div>

        {/* RESULTADOS */}

        {inventarios.length > 0 && (
          <div className="mt-4 rounded-lg border border-slate-200 bg-white shadow-sm">

            <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <h2 className="text-lg font-semibold text-slate-700">
                  Inventario del producto
                </h2>

                <p className="text-sm text-slate-500">
                  Código:{" "}
                  <span className="font-medium text-slate-700">
                    {codigo}
                  </span>
                </p>
              </div>

              <input
                type="text"
                placeholder="Filtrar resultados..."
                className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>

            <div className="p-3">
              <TableInventarios
                inventarios={filteredData}
              />
            </div>

          </div>
        )}

      </div>

      <LoadingSpinnerScreen
        open={openLoadingSpinner}
      />
    </>
  );
};