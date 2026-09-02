import React, { useState } from 'react'
import { IFiltroProductosCRM } from '../../../../interfaces/ecommerce.interface';
import { FiltroTablaProductos } from './components/FiltroTablaProductos';
import { TableProductos } from './components/TableProductos';

export const EproductosPage = () => {


  const [filtros, setFiltros] = useState<IFiltroProductosCRM>({buscar: ""});

  return (
    <>
      <div className='px-5 m-5'>
        <p className='my-6 font-bold'>Control de productos </p>

        {/* <Button type="button" onClick={handleCrearCategoria}>Crear Producto</Button> */}
        <div className='pe-3'>
          <FiltroTablaProductos onChange={setFiltros} />
          <br />
          <TableProductos filtros={filtros} />
        </div>

      </div>
    </>
  )
}
