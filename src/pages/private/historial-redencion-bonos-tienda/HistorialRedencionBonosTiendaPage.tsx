import React, { useEffect, useState } from "react";
import { Title } from "../../../components/title/Title";

import { obtenerVentasPos } from "../../../actions/pos/pos";
import LoadingSpinnerScreen from "../../../components/loadingSpinnerScreen/LoadingSpinnerScreen";
import Swal from "sweetalert2";
import { useFilteredData } from "../../../hooks/useFilteredData";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../../store/user/user";
import { obtenerRangoMesActual } from "../../../utils/obtenerRangoMesActual";
import { FiltroHistoriarlRedencion } from "./components/FiltroHistoriarlRedencion";
import { TablaRedencionBonos } from "./components/TablaRedencionBonos";
import { IBonoRedimidosResumen, IFiltrosRedencionBonosTienda } from "../../../interfaces/redencion_bonos.interface";
import { obtenerBonosRedimidosTienda } from "../../../actions/entidad_bono/entidad_bono";


export const HistorialRedencionBonosTiendaPage = () => {

  const rangoMesActual = obtenerRangoMesActual();
  const navigate = useNavigate();
  const [openLoadingSpinner, setOpenLoadingSpinner] = useState(false);
  const session = useUserStore((state) => state.user);
  
  const [filtros, setFiltros] = useState<IFiltrosRedencionBonosTienda>({
    id_tienda: "",
    fecha_inicial: rangoMesActual.fechaInicial,
    fecha_final: rangoMesActual.fechaFinal,
    documento_cliente: "",
  });

  

  const [bonosRedimidos, setBonosRedimidos] = useState<IBonoRedimidosResumen[]>([]);
  const { search, setSearch, filteredData } = useFilteredData(bonosRedimidos);
  /**
   * Cargar ventas
   */
  const cargarBonosRedimidos = async (filtrosBusqueda: IFiltrosRedencionBonosTienda) => {
    try {

      setOpenLoadingSpinner(true);
      try {
        const response = await obtenerBonosRedimidosTienda(filtrosBusqueda);
        if(response?.error==0 && response?.bonosRedimidos){
           setBonosRedimidos(response?.bonosRedimidos || []);
        }else{
          Swal.fire(response!.msg )
        }

      } catch (error) {
        Swal.fire({ icon:'error', text:'Error al cargar los bonos redimidos, contactese con el administrador'})
      } finally {
        setOpenLoadingSpinner(false);
      }



    } catch (error) {
      console.error("Error cargando los bonos:",error);
      setBonosRedimidos([]);
    }
  };

  /**
   * Carga inicial
   *
   * Por defecto:
   * 01 del mes actual -> día actual
   */
  useEffect(() => {
    cargarBonosRedimidos(filtros);
  }, []);

  /**
   * Filtrar bonos
   */
  const handleFiltrarBonos = (nuevosFiltros: IFiltrosRedencionBonosTienda) => {

    setFiltros(nuevosFiltros);
    cargarBonosRedimidos(nuevosFiltros);
  };

  const handleRedimirNuevoBono = () => {
    navigate("/redencion_bonos_tienda");
  };

  return (
    <>
      <Title title="Administrador de bonos redimidos" />
    
      <div className="bg-slate-100 min-h-screen p-2 w-[98%]">

        <div className="bg-white border border-slate-200 rounded-sm shadow-sm">

          {/* BOTÓN AGREGAR */}
          {
            (session?.cod_perfil == 8) && 
              <div className="p-3">
                <button
                  type="button"
                  onClick={handleRedimirNuevoBono}
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
                  Redencion bono
                </button>
              </div>
          }

          {/* FILTROS */}

          <div className="border-t border-slate-200">
            <FiltroHistoriarlRedencion
              filtros={filtros}
              onFiltrar={handleFiltrarBonos}
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
            <TablaRedencionBonos 
              bonosRedimidos={filteredData}
            />
          </div>

        </div>

      </div>
      <LoadingSpinnerScreen open={openLoadingSpinner} />
    </>
  );
};