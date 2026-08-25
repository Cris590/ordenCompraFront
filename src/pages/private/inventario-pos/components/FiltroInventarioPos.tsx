import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  ListItemText,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";

import { IoStorefrontOutline } from "react-icons/io5";
import { IFiltroInventarios } from "../../../../interfaces/pos.interface";
import Swal from "sweetalert2";
import { obtenerTiendasPosUsuario } from "../../../../actions/pos/pos";
import { useUserStore } from "../../../../store/user/user";

interface FiltrosVentasProps {
  filtros: IFiltroInventarios;
  onFiltrar: (nuevosFiltros: IFiltroInventarios) => void;
}

export const FiltroInventarioPos = ({
  filtros,
  onFiltrar,
}: FiltrosVentasProps) => {
  const [filtrosLocal, setFiltrosLocal] =useState<IFiltroInventarios>(filtros);

  const [tiendas, setTiendas] = useState<{ id: number; nombre: string }[]>([]);

  const session = useUserStore((state) => state.user);

  useEffect(() => {
    obtenerTiendas();
  }, []);

  useEffect(() => {
    setFiltrosLocal(filtros);
  }, [filtros]);

  const handleChange = (valor: number[]) => {
    setFiltrosLocal((actual) => ({
      ...actual,
      id_tienda: valor,
    }));
  };

  const handleFiltrar = () => {
    onFiltrar(filtrosLocal);
  };

  const obtenerTiendas = async () => {
    try {
      const res = await obtenerTiendasPosUsuario();

      if (res?.error) {
        Swal.fire(res.msg);
        return;
      }

      setTiendas(res?.bodegas || []);

      if (res?.idTiendaObligatorio) {
        setFiltrosLocal((actual) => ({
          ...actual,
          id_tienda: [Number(res.idTiendaObligatorio)],
        }));
      }
    } catch (e) {
      Swal.fire({
        icon: "error",
        text: "Comuniquese con el administrador",
      });
    }
  };

  return (
    <Box className="border-b border-slate-200 bg-white px-5 py-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end">

        {/* TIENDA */}
        <div className="w-full lg:max-w-md">
          <Typography
            variant="body2"
            fontWeight={700}
            className="mb-1.5 block text-slate-700"
          >
            Tienda
          </Typography>

          <TextField
            select
            size="small"
            fullWidth
            disabled={session?.cod_perfil == 8}
            value={filtrosLocal.id_tienda || []}
            onChange={(event) => {
              const value = event.target.value;

              const tiendasSeleccionadas =
                typeof value === "string"
                  ? value.split(",").map(Number)
                  : value;

              handleChange(tiendasSeleccionadas);
            }}
            SelectProps={{
              multiple: true,
              displayEmpty: true,
              renderValue: (selected) => {
                const ids = selected as number[];

                if (!ids.length) {
                  return (
                    <span className="text-slate-400">
                      Todas las tiendas
                    </span>
                  );
                }

                const nombres = tiendas
                  .filter((tienda) => ids.includes(tienda.id))
                  .map((tienda) => tienda.nombre);

                return nombres.join(", ");
              },
            }}
            InputProps={{
              startAdornment: (
                <IoStorefrontOutline
                  size={18}
                  className="mr-2 text-slate-500"
                />
              ),
            }}
          >
            {tiendas.map((tienda) => (
              <MenuItem key={tienda.id} value={tienda.id}>
                <Checkbox
                  size="small"
                  checked={
                    filtrosLocal.id_tienda?.includes(tienda.id) || false
                  }
                />

                <ListItemText primary={tienda.nombre} />
              </MenuItem>
            ))}
          </TextField>
        </div>

        {/* BOTÓN */}
        <div className="w-full lg:w-auto">
          <Button
            variant="contained"
            size="medium"
            onClick={handleFiltrar}
            className="h-10 min-w-[180px]"
          >
            Filtrar inventarios
          </Button>
        </div>
      </div>
    </Box>
  );
};