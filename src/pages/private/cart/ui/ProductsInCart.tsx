import { useEffect, useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Link } from 'react-router-dom';
import { useCartStore } from '../../../../store/cart/cart-store';
import { QuantitySelector } from '../../../../components/product/quantity-selector/QuantitySelector';
import { ColorCircle } from '../../../../components/product/color-circle/ColorCircle';
import { CartProducto } from '../../../../interfaces/cart.interface';



export const ProductsInCart = () => {

  const updateProductQuantity = useCartStore( state => state.updateProductQuantity );
  const categoriasSeleccionada = useCartStore(state => state.categoriasSeleccionada);
  const removeProduct = useCartStore( state => state.removeProduct );
  const [maxQuantityReached, setMaxQuantityReached] = useState<boolean>(false);

  const [loaded, setLoaded] = useState(false);
  const productsInCart = useCartStore( state => state.cart );


  useEffect(() => {
    setLoaded(true) ;
  });

  const handleCantidadSeleccionada = (product:CartProducto , cantidad:number) =>{
    updateProductQuantity(product, cantidad)
    let {cantidadMaxima ,cantidadSeleccionada } = categoriasSeleccionada[product.cod_categoria]
    let cantidadNuevaSeleccionada = cantidad + cantidadSeleccionada
    // setQuantity(cantidad)
    setMaxQuantityReached(cantidadSeleccionada > cantidadMaxima)
   
    
  }




  if( !loaded ) {
    return <p>Loading...</p>
  }

  return (
    <>
      {productsInCart.map((product) => (
        <div key={ `${ product.cod_producto }-${ product.talla } - ${product.cod_color_producto}`  } className="flex mb-5">
          <LazyLoadImage
            src={`${product.imagen }`}
            width={100}
            height={100}
            style={{
              width: "100px",
              height: "100px",
            }}
            alt={product.nombre}
            className="mr-5 rounded"
          />

          <div>
            {/* <Link 
              className="hover:underline cursor-pointer"
              to={ `/product/${ product.slug } ` }>
              { product.size } - {product.title}
            </Link> */}
            
            <p className='font-semibold my-2 text-md'>{product.categoria}</p>
            <QuantitySelector 
              quantity={ product.cantidad } 
              onQuantityChanged={(cantidad)=>handleCantidadSeleccionada(product, cantidad)}
              disabled={maxQuantityReached}
            />

            { (product.tiene_color === 1) && 
              <div className='my-2'>
                <ColorCircle size='1.3' color={product.color} />
              </div>
            }

            
            { (product.tiene_talla === 1) && 
              <p className='my-2'><span  className='font-bold'>Talla: </span> {product.talla}</p>
            }

            <button 
              onClick={ () => removeProduct(product) }
              className="underline mt-1">Remover</button>
          </div>
        </div>
      ))}
    </>
  );
};