import React, { useState } from "react";
import { Button, Tooltip } from "@mui/material";
import DataTable from "react-data-table-component";

import {
  IoHandLeftSharp,
} from "react-icons/io5";

import { IVentaPOSAdmin } from "../../../../interfaces/pos.interface";
import { formatDate } from "../../../../utils/formatDate";
import LoadingSpinnerScreen from "../../../../components/loadingSpinnerScreen/LoadingSpinnerScreen";
import { useNavigate } from "react-router-dom";

interface Props {
  ventas: IVentaPOSAdmin[];
}

const formatMoney = (value: number) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);

export const TablaRetomarVentas = ({ventas}: Props) => {

 
  const [openLoadingSpinner, setOpenLoadingSpinner] = useState(false);
  const navigate = useNavigate();
  const handleRetomarVenta = (venta: IVentaPOSAdmin) => {
    navigate('/retomar_venta/' + venta.id.toString())
  };


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
      name: "Deuda",
      selector: (row: IVentaPOSAdmin) =>
        row.deuda,
      sortable: true,
      cell: (row: IVentaPOSAdmin) =>
        formatMoney(row.deuda),
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

          {/* RETOMAR VENTA */}
          <Tooltip title="Retomar Venta">
            <Button
              variant="contained"
              size="small"
              onClick={() => handleRetomarVenta(row)}
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
              <IoHandLeftSharp size={19} />
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

      <LoadingSpinnerScreen open={openLoadingSpinner} />
    </>
  );
};