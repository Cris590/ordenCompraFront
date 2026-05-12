import React, { useEffect, useState } from 'react'
import { productosPorCategoria } from '../../../../../actions/categorias/categorias'
import { IProductoResumen } from '../../../../../interfaces/producto.interface'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import DataTable from 'react-data-table-component'
import { ColorCircle } from '../../../../../components/product/color-circle/ColorCircle'
import LoadingSpinnerScreen from '../../../../../components/loadingSpinnerScreen/LoadingSpinnerScreen'
import { useFilteredData } from '../../../../../hooks/useFilteredData'

interface Props {
  codCategoria: number,
  categoria: string,
  open: boolean,
  handleClose: () => void
}

export const ProductosCategoria = ({
  codCategoria,
  open,
  categoria,
  handleClose
}: Props) => {
  const [productos, setProductos] = useState<IProductoResumen[]>([])
  const [openLoadingSpinner, setLoadingSpinner] = useState<boolean>(false)
  const { search, setSearch, filteredData } = useFilteredData(productos);

  const columns = [
    {
      name: 'Nombre',
      selector: (row: IProductoResumen) => row.nombre,
    },
    {
      name: 'Tallas',
      selector: (row: IProductoResumen) => (row.tiene_talla && row.talla) ? row.talla.join(',') : '',
    },
    {
      name: 'Colores',
      cell: (row: IProductoResumen) => (
        row.tiene_color ? (
          <div className='flex flex-row justify-center'>
            {row.color.map((color, index) => (
              <ColorCircle key={index} size='1' color={color.color} description={color.color_descripcion} />
            ))
            }
          </div>
        ) : <div></div>
      ),
    },
    {
      name: 'Categoria',
      selector: (row: IProductoResumen) => row.categoria,
      // sortable: true,
    },
    {
      name: 'Sexo',
      selector: (row: IProductoResumen) => row.sexo.map((value) => (value === "F" ? "Femenino" : "Masculino")).join(','),
    }
  ];

  useEffect(() => {
    if (open) {
      obtenerProductosPorCategoria()
    }
  }, [codCategoria, open])

  const obtenerProductosPorCategoria = async () => {
    setLoadingSpinner(true)
    let response = await productosPorCategoria(+codCategoria)
    setLoadingSpinner(false)
    if (response?.error === 0) {
      setProductos(response.productos)
    }
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth='lg'
      >
        <DialogTitle>Productos por categoria | {categoria}</DialogTitle>
        <DialogContent>
          <div className="container mx-auto p-4" style={{ width: '70rem' }}>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Buscar..."
                className="border rounded p-2"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

            </div>
            <DataTable
              columns={columns}
              data={filteredData}
              pagination
              highlightOnHover
            />

          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cerrar</Button>
        </DialogActions>
      </Dialog>
      <LoadingSpinnerScreen open={openLoadingSpinner} />
    </>
  )
}
