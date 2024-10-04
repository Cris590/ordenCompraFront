
import { ProductsInCart } from './ui/ProductsInCart';
import { OrderSummary } from './ui/OrderSummary';
import { Link, useNavigate } from 'react-router-dom';
import { Title } from '../../../components/title/Title';
import { ControlCategorias } from './ui/ControlCategorias';
import { Button } from '@mui/material';
import { useCartStore } from '../../../store/cart/cart-store';
import { DialogPoliticas } from './ui/DialogPoliticas';
import { useState } from 'react';
import Swal from 'sweetalert2';
import { useUserStore } from '../../../store/user/user';
import { crearOrdenCompra } from '../../../actions/orden_compra/orden_compra';

export const CartPage = () => {
  const [openDialog, setOpenDialog] = useState(false)
  const navigate = useNavigate()
  const {
    categoriasSeleccionada,
    cart,
    usuarioOrden,
    clearCart,
  } = useCartStore(state => state);
  
  const { user } = useUserStore(state => state);

  const verificarCantidad = () => {
    let verificacion = false
    if (categoriasSeleccionada && Object.keys(categoriasSeleccionada).length > 0) {
      for (const key of Object.keys(categoriasSeleccionada)) {
        let categoria = categoriasSeleccionada[key]
        if (categoria.cantidadMaxima !== categoria.cantidadSeleccionada) {
          verificacion = true
          break
        }
      }
    }
    return verificacion
  }

  const handleDialogCrearOrden = async (crearOrden?:boolean) =>{
    try {
    
      setOpenDialog(false)

      if(crearOrden){

        let data = {
          cod_usuario_creacion:user?.cod_usuario || 0,
          cod_usuario:usuarioOrden?.cod_usuario || 0,
          productos:cart
        }
        let res = await crearOrdenCompra(data)
        if(res){
          await Swal.fire(res.msg)
          if(res?.error == 0){
            clearCart()
            navigate('/resumen_orden/' + data.cod_usuario)
          }
        }
      } 
    } catch (e) {
      Swal.fire({
        icon:'error',
        text:'Error, comuniquese con el administrador'
      })      
    }
  }

  return (

    <div className="grid grid-cols-[20%_1fr]">
      <ControlCategorias />

      <div className="flex justify-center items-center mb-72 px-10 sm:px-0">

        <div className="flex flex-col w-[1000px]">

          <Title title='Carrito' />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">

            {/* Carrito */}
            <div className="flex flex-col mt-5">
              <span className="text-xl">Agregar más items</span>
              <Link to={`/ordenes-compra/${usuarioOrden?.cod_usuario}`} className="underline mb-5">
                Continúa comprando
              </Link>

              {/* Items */}
              <ProductsInCart />

            </div>


            {/* Checkout - Resumen de orden */}
            <div className="bg-white rounded-xl shadow-xl p-7 h-fit">
              <h2 className="text-2xl mb-2">Resumen de orden</h2>

              <OrderSummary />

              <div className="mt-5 mb-2 w-full">
                <Button variant='contained' disabled={verificarCantidad()} onClick={()=>setOpenDialog(true)}>Crear Solicitud de dotación </Button>
              </div>

              <DialogPoliticas 
                open={openDialog}
                onClose={handleDialogCrearOrden}
              />


            </div>
          </div>
        </div>
      </div>
    </div>
  );
}