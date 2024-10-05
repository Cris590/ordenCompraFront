
import { useEffect, useState } from "react";
import { useCartStore } from "../../../../store/cart/cart-store";
import { SizeSelector } from "../../../../components/product/size-selector/SizeSelector";
import { QuantitySelector } from "../../../../components/product/quantity-selector/QuantitySelector";
import { IProductoMostrar } from "../../../../interfaces/orden_compra.interface";
import { ColorSelector } from "../../../../components/product/color-selector/ColorSelector";
import { Button } from "@mui/material";
import { CartProducto } from "../../../../interfaces/cart.interface";

interface Props {
  producto: IProductoMostrar;
  cambiarColor: (colorSeleccionado: number) => void;
  guardarOrden?:boolean
}

export const AddToCart = ({ producto, cambiarColor, guardarOrden = true }: Props) => {

  const addProductToCart = useCartStore(state => state.addProductTocart);
  const categoriasSeleccionada = useCartStore(state => state.categoriasSeleccionada);
  
  const [size, setSize] = useState<string | undefined>();
  const [color, setColor] = useState<number | undefined>();
  const [quantity, setQuantity] = useState<number>(1);
  const [maxQuantityReached, setMaxQuantityReached] = useState<boolean>(false);
  const [posted, setPosted] = useState(false);

  const addToCart = () => {
    setPosted(true);

    if (
      (producto.tiene_talla && !size) ||   // Case 1: Missing size
      (producto.tiene_color && !color) ||  // Case 2: Missing color
      (producto.tiene_talla && producto.tiene_color && (!size || !color)) || // Case 3: Both missing
      maxQuantityReached
    ) return;

    let cartProducto: CartProducto = {
      cod_producto: producto.cod_producto,
      nombre: producto.nombre,
      talla: size || '',
      cod_color_producto: color || 0,
      color: obtenerColor(),
      imagen: obtenerImagenColor(),
      cantidad: quantity,
      tiene_color:producto.tiene_color,
      tiene_talla:producto.tiene_talla,
      cod_categoria:producto.cod_categoria,
      categoria:producto.categoria
    }

    addProductToCart(cartProducto);
    setPosted(false);
    setQuantity(1);
    handleCantidadSeleccionada(1)
    setSize(undefined);


  };

 

  useEffect(() => {
    let codColorInicial = 0
    if (producto.tiene_color && producto.colores && producto.colores.length > 0) {
      codColorInicial = producto.colores[0].cod_producto_color
    }

    setColor(codColorInicial)
    cambiarColor(codColorInicial)

    if (!producto.tiene_talla) {
      setSize(undefined)
    }
  }, [producto])


  const handleCambiarColor = (codProductoColor: number) => {
    setColor(codProductoColor)
    cambiarColor(codProductoColor)
  }

  const obtenerImagenColor = () =>{
    return producto.colores?.filter((colorFiltrado)=>colorFiltrado.cod_producto_color === color)[0].imagenes[0] || ''
  }

  const obtenerColor = () =>{
    return producto.colores?.filter((colorFiltrado)=>colorFiltrado.cod_producto_color === color)[0].color || ''
  }

  const handleCantidadSeleccionada = (cantidad:number) =>{
    
    let {cantidadMaxima ,cantidadSeleccionada } = categoriasSeleccionada[producto.cod_categoria]
    let cantidadNuevaSeleccionada = cantidad + cantidadSeleccionada
    setQuantity(cantidad)
    setMaxQuantityReached(cantidadNuevaSeleccionada > cantidadMaxima)
    
  }


  return (
    <>
      {posted && (producto.tiene_talla === 1) && !size && (
        <span className="mt-2 text-red-500 fade-in">
          Debe de seleccionar una talla*
        </span>
      )}

      {/* Selector de Tallas */}

      {(producto.tiene_talla === 1) &&
        <SizeSelector
          selectedSize={size}
          availableSizes={producto.talla}
          onSizeChanged={setSize}
        />
      }

      {/* Selector de Cantidad */}
      <QuantitySelector
        quantity={quantity}
        onQuantityChanged={handleCantidadSeleccionada}
        disabled={maxQuantityReached}
      />
      {((producto.tiene_color === 1) && producto.colores) &&
        <ColorSelector
          colorSeleccionado={color}
          colores={producto.colores}
          seleccionarColor={handleCambiarColor}
        />
      }

      {posted && (producto.tiene_color === 1) && !color && (
        <span className="mt-2 text-red-500 fade-in">
          Debe de seleccionar una color*
        </span>
      )}


      {/* Button */}
      {
        guardarOrden && 
          <Button onClick={addToCart} variant="outlined" className="btn-primary my-5">
            Agregar al carrito
          </Button>
      }

    </>
  );
};