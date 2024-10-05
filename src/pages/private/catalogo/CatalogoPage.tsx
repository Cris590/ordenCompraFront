import React, { useEffect, useState } from 'react'
import { IResumentProductos } from '../../../interfaces/entidad.interface'
import { useUserStore } from '../../../store/user/user'
import LoadingSpinnerScreen from '../../../components/loadingSpinnerScreen/LoadingSpinnerScreen'
import { obtenerProductosEntidadResumen } from '../../../actions/entidad/entidad'
import { ProductGridItem } from '../../../components/products/product-grid/ProductGridItem'

export const CatalogoPage = () => {

    const [cargosProductos, setCargosProductos] = useState<IResumentProductos[]>([])

    const [openLoadingSpinner, setLoadingSpinner] = useState<boolean>(false);

    const session = useUserStore((state) => state.user)

    useEffect(() => {
        resumenProductos()
    }, [])

    const resumenProductos = async () => {

        setLoadingSpinner(true)
        let response = await obtenerProductosEntidadResumen(session?.cod_entidad || 0)
        setLoadingSpinner(false)
        if (response?.error == 0) {
            setCargosProductos(response.response)
        }
    }


    return (
        <>
            <div className='container'>
                {
                    cargosProductos.map((cargo)=>(
                        
                            <div className='mx-2 border rounded-lg shadow-sm p-4 my-4'>
                                <p className='font-bold text-2xl'> {cargo.cargo }</p>
                                <hr />

                                {cargo.categorias.map((categoria)=>(
                                    <div className='mx-2'>
                                        <p className='font-semibold text-lg text-gray-500'>{ categoria.nombre} - Cantidad ( {categoria.cantidad})</p>
                                        <hr />
                                        { categoria.sexos.map((sexo)=>(
                                            <div className='mx-2'>
                                                <p className='font-semibold text-md'>{sexo.nombre}</p>
                                                <div className='grid grid-cols-2 sm:grid-cols-3 gap-10 mb-10 mt-10 px-10 h-full'>
                                                    { sexo.productos.map((producto)=>(
                                                        <ProductGridItem
                                                            key={ producto.cod_producto }
                                                            producto={ producto }
                                                            ruta='producto_visual'
                                                    />
                                                    ))}
                                                </div>
                                            </div>
                                        ))}

                                    </div>
                                ))}

                            </div>
                        
                    ))
                }

            </div>
            
            <LoadingSpinnerScreen open={openLoadingSpinner} />
        </>
    )
}
