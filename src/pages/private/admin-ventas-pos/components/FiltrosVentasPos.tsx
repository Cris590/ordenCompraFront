import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";

import {
  IoCalendarOutline,
  IoPersonOutline,
  IoStorefrontOutline,
} from "react-icons/io5";
import { IFiltrosVentasPOS } from "../../../../interfaces/pos.interface";
import Swal from "sweetalert2";
import { obtenerTiendasPosUsuario } from "../../../../actions/pos/pos";
import { useUserStore } from "../../../../store/user/user";



export interface FiltroVentas {
  tienda: string;
  fechaInicial: string;
  fechaFinal: string;
  documentoCliente: string;
}

interface FiltrosVentasProps {
  filtros: IFiltrosVentasPOS;
  onFiltrar: (nuevosFiltros: IFiltrosVentasPOS) => void;
}

export const FiltroVentasPOS = ({ filtros, onFiltrar }: FiltrosVentasProps) => {

  const [filtrosLocal, setFiltrosLocal] = useState<IFiltrosVentasPOS>(filtros);
  const [tiendas, setTiendas] = useState<{ id: number, nombre: string }[]>([])
  const session = useUserStore((state) => state.user);

  useEffect(() => {
    obtenerTiendas()
  }, [])

  useEffect(() => {
    setFiltrosLocal(filtros);
  }, [filtros]);

  const handleChange = (campo: keyof IFiltrosVentasPOS, valor: string) => {
    setFiltrosLocal((actual) => ({
      ...actual,
      [campo]: valor,
    }));
  };

  const handleFiltrar = () => {
    onFiltrar(filtrosLocal);
  };

  const obtenerTiendas = async () => {
    try {

      let res = await obtenerTiendasPosUsuario()
      if (res?.error) {
        Swal.fire(res.msg)
      } else {
        setTiendas(res?.bodegas || [])
        if (res?.idTiendaObligatorio) filtrosLocal.id_tienda = String(res.idTiendaObligatorio)
      }

    } catch (e) {
      Swal.fire({
        icon: "error",
        text: "Comuniquese con el administrador"
      })
    }
  }

  return (
    <Box className="border-b border-slate-200 p-5">

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5 xl:items-end">

        {/* TIENDA */}

        <div>
          <Typography
            variant="body2"
            fontWeight={700}
            className="mb-1"
          >
            Tienda:
          </Typography>

          <TextField
            select
            size="small"
            fullWidth
            disabled={session?.cod_perfil == 8}
            value={filtrosLocal.id_tienda}
            onChange={(event) => handleChange("id_tienda", event.target.value)
            }
            InputProps={{
              startAdornment: (
                <IoStorefrontOutline
                  size={18}
                  className="mr-2 text-slate-500"
                />
              ),
            }}
          >
            <MenuItem value="todas">
              Todas
            </MenuItem>

            {tiendas.map((tienda) => (
              <MenuItem
                key={tienda.id}
                value={String(tienda.id)}
              >
                {tienda.nombre}
              </MenuItem>
            ))}
          </TextField>
        </div>

        {/* FECHA INICIAL */}

        <div>
          <Typography
            variant="body2"
            fontWeight={700}
            className="mb-1"
          >
            Fecha inicial
          </Typography>

          <TextField
            type="date"
            size="small"
            fullWidth
            value={filtrosLocal.fecha_inicial}
            onChange={(event) =>
              handleChange(
                "fecha_inicial",
                event.target.value
              )
            }
            InputProps={{
              startAdornment: (
                <IoCalendarOutline
                  size={18}
                  className="mr-2 text-slate-500"
                />
              ),
            }}
          />
        </div>

        {/* FECHA FINAL */}

        <div>
          <Typography
            variant="body2"
            fontWeight={700}
            className="mb-1"
          >
            Fecha final
          </Typography>

          <TextField
            type="date"
            size="small"
            fullWidth
            value={filtrosLocal.fecha_final}
            onChange={(event) =>
              handleChange(
                "fecha_final",
                event.target.value
              )
            }
            InputProps={{
              startAdornment: (
                <IoCalendarOutline
                  size={18}
                  className="mr-2 text-slate-500"
                />
              ),
            }}
          />
        </div>

        {/* DOCUMENTO */}

        <div>
          <Typography
            variant="body2"
            fontWeight={700}
            className="mb-1"
          >
            Documento cliente
          </Typography>

          <TextField
            size="small"
            fullWidth
            value={filtrosLocal.documento_cliente}
            onChange={(event) =>
              handleChange(
                "documento_cliente",
                event.target.value
              )
            }
            placeholder="Documento"
            InputProps={{
              startAdornment: (
                <IoPersonOutline
                  size={18}
                  className="mr-2 text-slate-500"
                />
              ),
            }}
          />
        </div>

        {/* BOTÓN */}

        <Button
          variant="contained"
          fullWidth
          size="medium"
          onClick={handleFiltrar}
          className="h-10"
        >
          Filtrar ventas
        </Button>

      </div>
    </Box>
  );
};