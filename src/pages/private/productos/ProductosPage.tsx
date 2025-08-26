
import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import DataTable from 'react-data-table-component';
import { useNavigate } from 'react-router-dom';
import { IProductoResumen } from '../../../interfaces/producto.interface';
import { ColorCircle } from '../../../components/product/color-circle/ColorCircle';
import { obtenerProductos } from '../../../actions/producto/producto';
import { Title } from '../../../components/title/Title';
import { useFilteredData } from '../../../hooks/useFilteredData';
import LoadingSpinnerScreen from '../../../components/loadingSpinnerScreen/LoadingSpinnerScreen';



export const ProductosPage = () => {

  const navigate = useNavigate()
  const [productos, setProductos] = useState<IProductoResumen[]>([]);
  const [openLoadingSpinner, setOpenLoadingSpinner] = useState(false)
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
    },
    {
      name: 'Estado',
      selector: (row: IProductoResumen) => (row.activo === 1) ? 'Activo' : 'Inactivo',
    },
    {
      name: 'Actions',
      cell: (row: IProductoResumen) => (
        <button
          onClick={() => handleClickOpen(row.cod_producto)}
          className="bg-blue-500 text-white px-2 py-1 rounded"
        >
          Editar
        </button>
      ),
    },
  ];

  useEffect(() => {
    obtenerTodosProductos()
  }, [])

  const obtenerTodosProductos = async () => {
    setOpenLoadingSpinner(true)
    let response = await obtenerProductos()
    setOpenLoadingSpinner(false)
    if (response?.error == 0) {
      setProductos(response.productos)
    }
  }

  const handleClickOpen = (codProducto: number = 0) => {
    navigate(`editar-producto/${codProducto}`)
  };


  return (
    <div className="container mx-auto p-4">
      <Title title="Productos" />
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar..."
          className="border rounded p-2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Button className='ml-4' variant="outlined" onClick={() => handleClickOpen()}>
          Crear Producto
        </Button>

      </div>
      <DataTable
        columns={columns}
        data={filteredData}
        pagination
        highlightOnHover
      />
       <LoadingSpinnerScreen open={openLoadingSpinner} />

    </div>
  );
}