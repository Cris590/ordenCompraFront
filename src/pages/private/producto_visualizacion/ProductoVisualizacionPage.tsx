
import { useEffect, useState } from 'react';
import { ProductMobileSlideshow } from '../../../components/product/slideshow/ProductMobileSlideshow';
import { ProductSlideshow } from '../../../components/product/slideshow/ProductSlideshow';
import { IProductoMostrar } from '../../../interfaces/orden_compra.interface';
import { AddToCart } from '../producto/ui/AddToCart';
import { useNavigate, useParams } from "react-router-dom";
import { obtenerProductoDetalleCarro } from '../../../actions/orden_compra/orden_compra';
import { BreadCrumbsCart } from '../producto/ui/BreadCrumbsCart';
import { ControlCategorias } from '../cart/ui/ControlCategorias';
import { Dialog, DialogContent } from '@mui/material';
import { BreadCrumbsProduct } from './components/BreadCrumbsProduct';



export const ProductoVisualizacionPage = () => {

  const { codProducto } = useParams<{ codProducto: string }>();
  const [imagenesColor, setImagenesColor] = useState<string[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [producto, setProducto] = useState<IProductoMostrar>({
    cod_producto: 0,
    cod_categoria: 0,
    nombre: '',
    tiene_talla: 0,
    tiene_color: 0,
    talla: [],
    categoria: '',
    descripcion: ''
  })
  const navigate = useNavigate()

  useEffect(() => {
    obtenerProducto()
  }, [codProducto])

  const obtenerProducto = async () => {
    try {
      if (codProducto) {


        let response = await obtenerProductoDetalleCarro(+codProducto)
        if (response) {

          if (response.error == 1) {
            navigate('/catalogo')
          } else {
            setProducto(response.producto)
          }
        }
      } else {
        navigate('/catalogo')
      }
    } catch (e) {
      navigate('/catalogo')
    }
  }

  const cambiarColor = (colorSeleccionado: number) => {

    let colores = producto.colores
    if (colores) {
      let colorFiltrado = colores.filter((color) => color.cod_producto_color === colorSeleccionado)[0]
      setImagenesColor(colorFiltrado.imagenes)
    }
  }

  return (

    <>
      <br />
      <br />
      <BreadCrumbsProduct />

      <div className="mx-5">
     
        <div className="mx-5 mt-5 mb-20 grid grid-cols-1 md:grid-cols-2 gap-3">

          {/* Slideshow */}
          <div className="col-span-1 md:col-span-1 ">
            {/* Mobile Slideshow */}
            <ProductMobileSlideshow
              title={producto.nombre}
              images={imagenesColor}
              className="block md:hidden"
            />

            {/* Desktop Slideshow */}
            <ProductSlideshow
              title={producto.nombre}
              images={imagenesColor}
              className="hidden md:block"
            />
          </div>

          {/* Detalles */}
          <div className="col-span-1 px-5">

            <h1 className={`antialiased font-bold text-xl`}>
              {producto.nombre}
            </h1>

            {/* <p className="text-lg mb-5">${producto.price}</p> */}



            {producto.url_tallaje &&

              <>
                <div className='my-2'>
                  <a className=' text-blue-600 hover:text-blue-700 hover:underline cursor-pointer' onClick={() => setIsDialogOpen(true)}>Formato de tallajes</a>
                </div>
                <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} maxWidth="md" fullWidth>
                  <DialogContent>
                    <img src={producto.url_tallaje} alt={`Image`} style={{ width: '100%' }} />
                  </DialogContent>
                </Dialog>
              </>
            }

            <p className='font-md my-2'>{producto.descripcion}</p>

            <AddToCart guardarOrden={false} producto={producto} cambiarColor={cambiarColor} />



            {/* Descripción */}
            {/* <h3 className="font-bold text-sm">Descripción</h3>
          <p className="font-light">{producto.description}</p> */}
          </div>
        </div>
      </div>
    </>
  );
}