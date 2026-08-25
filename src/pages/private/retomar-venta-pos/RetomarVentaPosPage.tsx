import React, { useEffect, useState } from "react";
import { Title } from "../../../components/title/Title";

import { TablaRetomarVentas } from "./components/TablaRetomarVentas";
import {
  IFiltrosVentasPOS,
  IVentaPOSAdmin,
} from "../../../interfaces/pos.interface";
import { obtenerVentasPendientesPos, obtenerVentasPos } from "../../../actions/pos/pos";
import LoadingSpinnerScreen from "../../../components/loadingSpinnerScreen/LoadingSpinnerScreen";
import Swal from "sweetalert2";
import { useFilteredData } from "../../../hooks/useFilteredData";
import { FiltroVentasPOS } from "../admin-ventas-pos/components/FiltrosVentasPos";

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

export const RetomarVentaPosPage = () => {

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

      setOpenLoadingSpinner(true);
      try {
        const response = await obtenerVentasPendientesPos(filtrosBusqueda);
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

  return (
    <>
      <Title title="Administrador de ventas" />
    
      <div className="bg-slate-100 min-h-screen p-2 w-[98%]">

        <div className="bg-white border border-slate-200 rounded-sm shadow-sm">

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
            <TablaRetomarVentas ventas={filteredData}/>
          </div>

        </div>

      </div>
      <LoadingSpinnerScreen open={openLoadingSpinner} />
    </>
  );
};