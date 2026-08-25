import React, { useEffect, useState } from 'react'
import { FiltroInventarioPos } from './components/FiltroInventarioPos'
import { IFiltroInventarios, IInventarioProducto } from '../../../interfaces/pos.interface';
import Swal from 'sweetalert2';
import LoadingSpinnerScreen from '../../../components/loadingSpinnerScreen/LoadingSpinnerScreen';
import { Button } from '@mui/material';
import { IoSwapHorizontalOutline } from 'react-icons/io5';
import { Title } from '../../../components/title/Title';
import { useFilteredData } from '../../../hooks/useFilteredData';
import { TableInventarios } from './components/TableInventarios';
import { obtenerInventariosPos } from '../../../actions/pos/pos';

export const InventarioPosPage = () => {
  const [filtros, setFiltros] = useState<IFiltroInventarios>({ id_tienda: [] });
  const [openLoadingSpinner, setOpenLoadingSpinner] = useState(false);
 
  const [inventarios, setInventarios] = useState<IInventarioProducto[]>([])
  const { search, setSearch, filteredData } = useFilteredData(inventarios);

  const handleFiltrarVentas = (nuevosFiltros: IFiltroInventarios) => {

    setFiltros(nuevosFiltros);
    cargarInventarios(nuevosFiltros);
  };

  const cargarInventarios = async (filtrosBusqueda: IFiltroInventarios) => {
    try {

      console.log("Cargando ventas con filtros:",filtrosBusqueda);
      setOpenLoadingSpinner(true);
      try {
        const response = await obtenerInventariosPos(filtrosBusqueda);
        if(response?.error==0 && response?.inventarios){
           setInventarios(response?.inventarios || []);
        }else{
          Swal.fire(response!.msg )
        }

      } catch (error) {
        Swal.fire({ icon:'error', text:'Error al cargar las ventas, contactese con el administrador'})
      } finally {
        setOpenLoadingSpinner(false);
      }



    } catch (error) {
      console.error("Error cargando ventas:", error);
      // setVentas([]);
    }
  };

  useEffect(() => {
    cargarInventarios(filtros);
  }, []);

  return (
    <>

      <Title title="Administrador de ventas" />

      <div className="bg-slate-100 min-h-screen p-2 w-[98%]">

        <div className="bg-white border border-slate-200 rounded-sm shadow-sm">

        
          {/* FILTROS */}

          <div className="border-t border-slate-200">
            <FiltroInventarioPos
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
            <TableInventarios
              inventarios={filteredData}
            />
          </div>

        </div>

      </div>
      <LoadingSpinnerScreen open={openLoadingSpinner} />

    </>
  )
}
