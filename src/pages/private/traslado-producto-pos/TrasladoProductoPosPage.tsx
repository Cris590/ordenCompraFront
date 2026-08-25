import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { IoSwapHorizontalOutline } from "react-icons/io5";
import { TrasladoProductosModal } from "./components/TrasladoProductosModal";
import LoadingSpinnerScreen from "../../../components/loadingSpinnerScreen/LoadingSpinnerScreen";
import { Title } from "../../../components/title/Title";
import { FiltroInventarioPos } from "../inventario-pos/components/FiltroInventarioPos";

export const TrasladoProductoPosPage = () => {
  const [openTraslado, setOpenTraslado] = useState(false);

  return (
    <Box className="min-h-screen bg-slate-100 p-4 md:p-6">
      <div className="mx-auto max-w-[1600px]">

        <div className="mb-5 flex items-center justify-between">
          <div>
            <Typography
              variant="h5"
              fontWeight={700}
            >
              Traslado de productos
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Gestión de movimientos entre bodegas
            </Typography>
          </div>

        </div>
         <Button
            variant="contained"
            startIcon={<IoSwapHorizontalOutline size={20} />}
            onClick={() => setOpenTraslado(true)}
          >
            Nuevo traslado
          </Button>

        {/* Aquí posteriormente irá la tabla de traslados */}

        <TrasladoProductosModal
          open={openTraslado}
          onClose={() => setOpenTraslado(false)}
        />

      </div>
    </Box>
  );
}
