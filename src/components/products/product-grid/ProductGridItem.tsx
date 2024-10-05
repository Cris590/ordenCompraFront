
import { useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Link } from 'react-router-dom';
import { IProductoMostrar } from '../../../interfaces/orden_compra.interface';
import { Card } from '@mui/material';
import { ColorCircle } from '../../product/color-circle/ColorCircle';

interface Props {
  producto: IProductoMostrar;
  ruta?:string
}


export const ProductGridItem = ({ producto , ruta="producto" }: Props) => {

  const [displayImage, setDisplayImage] = useState<string>(producto?.colores?.[0]?.imagenes?.[0] || '');


  return (

    <Card>
      <div className="rounded-md overflow-hidden fade-in">

        <Link to={`/${ruta}/${producto.cod_producto}`}>
          <div style={{ minHeight: '300px' }}>

            <LazyLoadImage
              src={displayImage}
              alt={producto.nombre}
              className="w-full object-cover rounded"
              width={300}
              height={300}
              onMouseEnter={() => {
                let imagenEnter = producto?.colores?.[0]?.imagenes?.[1] || ''
                if(imagenEnter){
                  setDisplayImage(imagenEnter)
                }
                
              }}
              onMouseLeave={() => setDisplayImage(producto?.colores?.[0]?.imagenes?.[0] || '')}
            />
          </div>
        </Link>

        <div className="p-4 flex flex-col">

          <p className='font-bold text-lg text-gray-500 '> {producto.categoria}</p>
          <Link
            className="hover:text-blue-600"
            to={`/${ruta}/${producto.cod_producto}`}>
            {producto.nombre}
          </Link>

          <p className='font-semibold my-2 break-words'>{producto.tiene_talla ?  producto.talla.join(',') : ''}</p>
          {/* <span className="font-bold">${ producto.price }</span> */}
          {
            (producto.colores && producto.tiene_color) && (
              <div className='flex flex-row justify-start my-2'>
                {producto.colores.map((color, index) => (
                  <ColorCircle key={index} size='1' color={color.color} description={color.color_descripcion} />
                ))
                }
              </div>)
          }
        </div>

      </div>
    </Card>
  );
};