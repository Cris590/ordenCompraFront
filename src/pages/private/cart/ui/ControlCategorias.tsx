import React, { useEffect, useState } from 'react'
import { useCartStore } from '../../../../store/cart/cart-store'

interface Props{
    mostrarSoloTotal?:boolean
}

export const ControlCategorias = ( { mostrarSoloTotal }:Props ) => {
    const {categoriasSeleccionada ,categorias, usuarioOrden} = useCartStore((state) => state)
    const getCantidadSeleccionada = (codCategoria:number) =>{
        if(categoriasSeleccionada[codCategoria]){
            return categoriasSeleccionada[codCategoria].cantidadSeleccionada
        }else{
            return 0
        }
    }

    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        setLoaded(true);
    }, [])


    return (
        <div className=" w-60 bg-gray-100 shadow-lg mt-4 p-4">
          
            <div className='my-3 border-gray-3 border-b-2'>
                <p className='font-bold text-sm'>NOMBRE ENTIDAD</p>
                <p>{usuarioOrden?.entidad}</p>
            </div>
            <div className='my-3 border-gray-3 border-b-2'>
                <p className='font-bold text-sm'>NIT ENTIDAD</p>
                <p>{usuarioOrden?.nit}</p>
            </div>
            <div className='my-3 border-gray-3 border-b-2'>
                <p className='font-bold text-sm'>NOMBRE PERSONA</p>
                <p>{usuarioOrden?.usuario}</p>
            </div>
            <div className='my-3 border-gray-3 border-b-2'>
                <p className='font-bold text-sm'>DOCUMENTO</p>
                <p>{usuarioOrden?.cedula}</p>
            </div>
            
            <div className='my-3 border-gray-3 border-b-2'>
                <p className='font-bold text-sm'>CARGO</p>
                <p>{usuarioOrden?.cargo_entidad}</p>
            </div>

            <div className='my-3 border-gray-3 border-b-2'>
                <p className='font-bold text-sm'>SEXO</p>
                <p>{usuarioOrden?.sexo === 'M' ? 'Másculino' : 'Femenino'}</p>
            </div>

            <div className='my-3 border-gray-3 border-b-2'>
                <p className='font-bold text-sm'>COORDINADOR</p>
                <p>{usuarioOrden?.coordinador}</p>
            </div>

            <p className='font-bold text-lg'>CONTROL CATEGORIAS</p>
            {categorias.length === 0 &&
                <p>No hay categorias, por lo tanto no puede escoger productos</p>
            }

            {( loaded && 
            
            
            categorias.length > 0) &&

                categorias.map((categoria) => (
                    <div key={categoria.cod_categoria} className='mt-5 border-b border-gray-300 p-1'>
                        <p className='text-sm font-semibold'>{categoria.nombre}</p>
                        
                        {mostrarSoloTotal && 
                            <p className='text-xs mt-1 ms-2'>Total: ({categoria.cantidad})</p>
                        }
                        {!mostrarSoloTotal && 
                            <p className='text-xs mt-1 ms-2'>( {getCantidadSeleccionada(categoria.cod_categoria)} ) de  ({categoria.cantidad}) productos escogido(s)</p>
                        }
                    </div>
                ))
            }

        </div>
    )
}
