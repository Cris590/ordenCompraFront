import React, { useState } from "react";
import { Button, Tooltip } from "@mui/material";
import DataTable from "react-data-table-component";

import {
  IoPrintOutline,
  IoEyeOutline,
  IoCloseOutline,
} from "react-icons/io5";

import { IVentaPOSAdmin } from "../../../../interfaces/pos.interface";
import { ModalDetalleVenta } from "./ModalDetalleVenta";
import { formatDate } from "../../../../utils/formatDate";
import Swal from "sweetalert2";
import { generarFacturaPdf } from "../../../../actions/pos/pos";
import LoadingSpinnerScreen from "../../../../components/loadingSpinnerScreen/LoadingSpinnerScreen";

interface Props {
  ventas: IVentaPOSAdmin[];
  onAnularVenta: (venta: IVentaPOSAdmin) => void;
}

const formatMoney = (value: number) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);

export const TablaVentasPOS = ({ventas,onAnularVenta}: Props) => {

  const [ventaSeleccionada, setVentaSeleccionada] = useState<IVentaPOSAdmin | null>(null);

  const [modalDetalleOpen, setModalDetalleOpen] = useState(false);

  const [openLoadingSpinner, setOpenLoadingSpinner] = useState(false);

  const handleVerVenta = (venta: IVentaPOSAdmin) => {
    setVentaSeleccionada(venta);
    setModalDetalleOpen(true);
  };

  const handleCerrarDetalle = () => {
    setModalDetalleOpen(false);
    setVentaSeleccionada(null);
  };



  const handleImprimirVenta = async (venta: IVentaPOSAdmin) => {
    try {
      setOpenLoadingSpinner(true)
      await generarFacturaPdf(venta.id)
      setOpenLoadingSpinner(false)

    } catch (e) {
      Swal.fire({
        icon: 'error',
        text: 'Error al crear la factura PDF'
      })
    }
  }
  const columns = [
    {
      name: "#",
      selector: (row: IVentaPOSAdmin) => row.id,
      sortable: true,
    },
    {
      name: "Código de factura",
      selector: (row: IVentaPOSAdmin) => row.codigo,
      sortable: true,
      wrap: true,
    },
    {
      name: "Tienda",
      selector: (row: IVentaPOSAdmin) => row.tienda,
      sortable: true,
      wrap: true,
    },
    {
      name: "Documento",
      selector: (row: IVentaPOSAdmin) =>
        row.documento_cliente,
      sortable: true,
      wrap: true,
    },
    {
      name: "Cliente",
      selector: (row: IVentaPOSAdmin) =>
        row.cliente,
      sortable: true,
      wrap: true,
    },
    {
      name: "Vendedor",
      selector: (row: IVentaPOSAdmin) =>
        row.vendedor,
      sortable: true,
      wrap: true,
    },
    {
      name: "Neto",
      selector: (row: IVentaPOSAdmin) =>
        row.neto,
      sortable: true,
      cell: (row: IVentaPOSAdmin) =>
        formatMoney(row.neto),
    },
    {
      name: "Total",
      selector: (row: IVentaPOSAdmin) =>
        row.total,
      sortable: true,
      cell: (row: IVentaPOSAdmin) => (
        <span className="font-semibold">
          {formatMoney(row.total)}
        </span>
      ),
    },
    {
      name: "Fecha",
      selector: (row: IVentaPOSAdmin) =>
        formatDate(row.fecha),
      sortable: true,
      wrap: true,
    },
    {
      name: "FE",
      selector: (row: IVentaPOSAdmin) =>
        row.fc,
      sortable: true,
      wrap: true,
    },
    {
      name: "Válida",
      selector: (row: IVentaPOSAdmin) =>
        row.factura_valida ? "Si" : "No",
      sortable: true,
    },
    {
      name: "Acciones",
      cell: (row: IVentaPOSAdmin) => (
        <div className="flex items-center">

          {/* IMPRIMIR */}
          <Tooltip title="Imprimir venta">
            <Button
              variant="contained"
              size="small"
              onClick={() => handleImprimirVenta(row)}
              sx={{
                minWidth: 38,
                width: 38,
                height: 36,
                borderRadius: 0,
                backgroundColor: "#00bcd4",
                "&:hover": {
                  backgroundColor: "#00acc1",
                },
              }}
            >
              <IoPrintOutline size={19} />
            </Button>
          </Tooltip>

          {/* VER */}
          <Tooltip title="Ver venta">
            <Button
              variant="contained"
              size="small"
              onClick={() => handleVerVenta(row)}
              sx={{
                minWidth: 38,
                width: 38,
                height: 36,
                borderRadius: 0,
                backgroundColor: "#f59e0b",
                "&:hover": {
                  backgroundColor: "#d97706",
                },
              }}
            >
              <IoEyeOutline size={19} />
            </Button>
          </Tooltip>

          {/* ANULAR */}
          <Tooltip title="Anular venta">
            <Button
              variant="contained"
              size="small"
              onClick={() => onAnularVenta(row)}
              sx={{
                minWidth: 38,
                width: 38,
                height: 36,
                borderRadius: 0,
                backgroundColor: "#ef4444",
                "&:hover": {
                  backgroundColor: "#dc2626",
                },
              }}
            >
              <IoCloseOutline size={20} />
            </Button>
          </Tooltip>

        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={ventas}
        pagination
        highlightOnHover
      />

      <ModalDetalleVenta
        open={modalDetalleOpen}
        venta={ventaSeleccionada}
        onClose={handleCerrarDetalle}
      />

      <LoadingSpinnerScreen open={openLoadingSpinner} />
    </>
  );
};