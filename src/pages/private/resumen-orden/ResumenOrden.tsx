import React, { useEffect, useState } from 'react'
import { useUserStore } from '../../../store/user/user';
import { validarOrdenUsuario } from '../../../actions/orden_compra/orden_compra';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { CardProducto } from './components/CardProducto';
import { IOrdenValidar } from '../../../interfaces/orden_compra.interface';
import { ControlCategorias } from '../cart/ui/ControlCategorias';
import { useCartStore } from '../../../store/cart/cart-store';
import { formatDate } from '../../../utils/formatDate';
import { TextField } from '@mui/material';
import { BreadCrumbsResumen } from './components/BreadCrumbsResumen';

export const ResumenOrden = () => {

  const { codUsuario } = useParams<{ codUsuario: string }>();
  const [orden, setOrden] = useState<IOrdenValidar>()
  const {setCategorias, setInfoUsuarioOrden} = useCartStore((state) => state)
  const session = useUserStore(state => state.user);
  const navigate = useNavigate()

  const location = useLocation();
  const { state } = location;
  const origin = state?.origin;


  useEffect(() => {

    if (
      (codUsuario && session?.cod_perfil === 3 && session?.cod_usuario === +codUsuario) ||
      (session?.cod_perfil === 2)
    ) {
      validarOrden()
    } else {
      navigate('/')
    }

  }, [session])


  const validarOrden = async () => {
    try {
      if (codUsuario && +codUsuario !== 0) {
        let ordenUsuario = await validarOrdenUsuario(+codUsuario || 0)
        if (ordenUsuario && ordenUsuario.error === 0 && (ordenUsuario.existe === 0)) {
          navigate('/ordenes-compra')
        } else if (ordenUsuario && ordenUsuario.existe === 1) {
          setInfoUsuarioOrden(ordenUsuario.usuario)
          setOrden(ordenUsuario.orden)
          setCategorias(ordenUsuario.categorias)
          
        } else {
          navigate('/')

        }
      } else {
        navigate('/ordenes-compra')
      }
    } catch (e) {
      Swal.fire({
        icon: 'error',
        text: 'Error al validar la orden de este usuario'
      })
    }
  }



  return (
    <>
      
      <br />
       {
        (session?.cod_perfil === 2) && <BreadCrumbsResumen  origin = {origin}/>
       }
      <h3 className='my-4 font-bold text-lg'>Resumen de orden</h3>

      <div className="w-100 bg-orange-400 p-4">
        <p> Solicitud no: <span className='font-bold uppercase'>{orden?.cod_orden}</span>, creada el <span className='font-bold'>( {formatDate(orden?.fecha_creacion || '')} )</span> por el usuario <span className='font-bold uppercase'>{orden?.usuario_creacion} </span> </p>
      </div>

      <div className="grid grid-cols-[20%_1fr]">


        <ControlCategorias mostrarSoloTotal={true} />
        <div>
          {
           ( session?.cod_perfil === 2 ) && (
            <>
              <div className='flex justify-start my-6'>
                <TextField
                  fullWidth
                  label="Ciudad"
                  variant="outlined"
                  disabled
                  value={orden?.ciudad}
                  InputLabelProps={{
                    shrink: Boolean(orden?.ciudad), // Force the label to shrink when there's a value
                  }}
                />
                <TextField
                  fullWidth
                  label="Dirección"
                  variant="outlined"
                  disabled
                  value={orden?.direccion}
                  InputLabelProps={{
                    shrink: Boolean(orden?.direccion), // Force the label to shrink when there's a value
                  }}
                />

                
              </div>
            
            </>
            )
          }

          <hr />

          <div className='grid grid-cols-4 '>
            {orden?.productos.map((producto) => <CardProducto key={`${producto.cod_producto}-${producto.cod_color_producto}-${producto.talla}`} producto={producto} />)}
          </div>
        </div>
      </div>
    </>
  )
}
