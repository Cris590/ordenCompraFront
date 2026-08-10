import React, { useEffect, useState } from 'react'
import { IColorProductoCrm, IProductoResumenCrm, ITallaProductoCrm } from '../../../../../../interfaces/ecommerce.interface'
import { obtenerDetalleProductoCrm } from '../../../../../../actions/ecommerce/ecommerce'
import Swal from 'sweetalert2'
import { ColorCircle } from '../../../../../../components/product/color-circle/ColorCircle'
import LoadingSpinnerScreen from '../../../../../../components/loadingSpinnerScreen/LoadingSpinnerScreen'
import { useProductoEdicionStore } from '../../../../../../store/ecommerce/producto-edicion'

export const TabResumenProducto = () => {
    const [tallas, setTallas] = useState<ITallaProductoCrm[]>([])
    const [colores, setColores] = useState<IColorProductoCrm[]>([])
    const [loading, setLoading] = useState(false);
    const producto = useProductoEdicionStore((state) => state.producto)

    const detalleProducto = async () => {
        try {
            setLoading(true)
            const detalle = await obtenerDetalleProductoCrm(producto.codigo_auxiliar)
            setLoading(false)

            setTallas(detalle?.tallas || [])
            setColores(detalle?.colores || [])
        } catch (e) {
            Swal.fire({
                icon: 'error',
                text: 'Error al obtener al detalle de los productos.'
            })
        }
    }

    useEffect(() => {
        detalleProducto()
    }, [producto])


    return (
        <>
            <div className="rounded-lg border bg-white p-5 shadow-sm">

                <div className="flex items-start justify-between">

                    <div>

                        <h2 className="text-xl font-semibold">
                            {producto.descripcion}
                        </h2>

                        <p className="text-sm text-gray-500">
                            {producto.categoria} / {producto.sub_categoria}
                        </p>

                        <p className="mt-1 font-mono text-sm">
                            {producto.codigo_modelo}
                        </p>

                    </div>

                    <div className="text-right">

                        <div>
                            <span className="text-xs text-gray-500">
                                Compra
                            </span>

                            <p className="font-semibold">
                                {producto.precio_compra.toLocaleString("es-CO", {
                                    style: "currency",
                                    currency: "COP"
                                })}
                            </p>

                        </div>

                        <div className="mt-2">
                            <span className="text-xs text-gray-500">
                                Venta
                            </span>

                            <p className="text-lg font-bold text-green-600">
                                {producto.precio_venta.toLocaleString("es-CO", {
                                    style: "currency",
                                    currency: "COP"
                                })}
                            </p>

                        </div>

                    </div>

                </div>

                <div className="mt-4 border-t pt-3 text-sm">
                    <span className="font-medium">Lote:</span> {producto.lote}
                </div>

                <div className="mt-5">
                    <h3 className="mb-2 text-sm font-semibold text-gray-700">
                        Colores
                    </h3>

                    <div className="flex flex-wrap items-center gap-2">

                        {colores.map(color => (
                            <ColorCircle
                                key={color.cod_producto_color}
                                color={color.color}
                                description={`${color.codigo_color} | ${color.nombre_color}`}
                                size={'3'}
                            />
                        ))}

                    </div>
                </div>

                <div className="mt-5">
                    <h3 className="mb-2 text-sm font-semibold text-gray-700">
                        Tallas
                    </h3>

                    <div className="flex flex-wrap gap-2">

                        {tallas.map(item => (
                            <div
                                key={item.talla}
                                className="rounded-md border border-gray-300 bg-gray-50 px-3 py-1 text-sm font-medium text-gray-700"
                            >
                                {item.talla}
                            </div>
                        ))}

                    </div>
                </div>
            </div>

            <LoadingSpinnerScreen open={loading} />
        </>
    )
}
