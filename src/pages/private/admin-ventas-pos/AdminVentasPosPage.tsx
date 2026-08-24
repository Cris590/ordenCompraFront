import React, { useEffect, useState } from "react";
import { Title } from "../../../components/title/Title";

import { FiltroVentasPOS } from "./components/FiltrosVentasPos";
import { TablaVentasPOS } from "./components/TablaVentasPos";
import {
  IFiltrosVentasPOS,
  IVentaPOSAdmin,
} from "../../../interfaces/pos.interface";
import { obtenerVentasPos } from "../../../actions/pos/pos";
import LoadingSpinnerScreen from "../../../components/loadingSpinnerScreen/LoadingSpinnerScreen";
import Swal from "sweetalert2";
import { useFilteredData } from "../../../hooks/useFilteredData";

const obtenerRangoMesActual = () => {
  const hoy = new Date();

  const anio = hoy.getFullYear();
  const mes = hoy.getMonth() + 1;
  const dia = hoy.getDate();

  return {
    fechaInicial: `${anio}-${String(mes).padStart(2, "0")}-01`,
    fechaFinal: `${anio}-${String(mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`,
  };
};

export const AdminVentasPosPage = () => {

  const rangoMesActual = obtenerRangoMesActual();
  const [openLoadingSpinner, setOpenLoadingSpinner] = useState(false);
  
  const [filtros, setFiltros] = useState<IFiltrosVentasPOS>({
    id_tienda: "",
    fecha_inicial: rangoMesActual.fechaInicial,
    fecha_final: rangoMesActual.fechaFinal,
    documento_cliente: "",
  });

  const [ventas, setVentas] = useState<IVentaPOSAdmin[]>([]);
  const { search, setSearch, filteredData } = useFilteredData(ventas);
  /**
   * Cargar ventas
   */
  const cargarVentas = async (filtrosBusqueda: IFiltrosVentasPOS) => {
    try {

      console.log("Cargando ventas con filtros:",filtrosBusqueda);
      setOpenLoadingSpinner(true);
      try {
        const response = await obtenerVentasPos(filtrosBusqueda);
        if(response?.error==0 && response?.ventas){
           setVentas(response?.ventas || []);
        }else{
          Swal.fire(response!.msg )
        }

      } catch (error) {
        Swal.fire({ icon:'error', text:'Error al cargar las ventas, contactese con el administrador'})
      } finally {
        setOpenLoadingSpinner(false);
      }



    } catch (error) {
      console.error("Error cargando ventas:",error);
      setVentas([]);
    }
  };

  /**
   * Carga inicial
   *
   * Por defecto:
   * 01 del mes actual -> día actual
   */
  useEffect(() => {
    cargarVentas(filtros);
  }, []);

  /**
   * Filtrar ventas
   */
  const handleFiltrarVentas = (nuevosFiltros: IFiltrosVentasPOS) => {

    setFiltros(nuevosFiltros);
    cargarVentas(nuevosFiltros);
  };

  const handleAgregarVenta = () => {
    console.log("Agregar venta");

    // navigate("/ventas-pos/nueva");
  };

  return (
    <>
      <Title title="Administrador de ventas" />
    
      <div className="bg-slate-100 min-h-screen p-2 w-[98%]">

        <div className="bg-white border border-slate-200 rounded-sm shadow-sm">

          {/* BOTÓN AGREGAR */}

          <div className="p-3">
            <button
              type="button"
              onClick={handleAgregarVenta}
              className="
                bg-sky-600
                hover:bg-sky-700
                text-white
                px-4
                py-2
                rounded
                text-sm
                font-medium
                transition-colors
              "
            >
              Agregar venta
            </button>
          </div>

          {/* FILTROS */}

          <div className="border-t border-slate-200">
            <FiltroVentasPOS
              filtros={filtros}
              onFiltrar={handleFiltrarVentas}
            />
          </div>

          {/* TABLA */}

          <div className="border-t border-slate-200 p-3">
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="border rounded p-2"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

            </div>
            <TablaVentasPOS
              ventas={filteredData}
              onAnularVenta={(venta) => {
                console.log("Anular:", venta);
              }}
            />
          </div>

        </div>

      </div>
      <LoadingSpinnerScreen open={openLoadingSpinner} />
    </>
  );
};