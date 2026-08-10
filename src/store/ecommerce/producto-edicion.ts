

import { create } from 'zustand'
import { persist } from 'zustand/middleware';
import { IInformacionBasicaEntidad } from '../../interfaces/entidad.interface';
import { IEditarProductoModeloCrm } from '../../interfaces/ecommerce.interface';

interface State {
    producto: IEditarProductoModeloCrm;
    setProducto: (producto: IEditarProductoModeloCrm) => void;
    resetProducto: () => void;
    setEdicionProducto: (productoEditado: Partial<IEditarProductoModeloCrm>)=>void
}

const productoDefault:IEditarProductoModeloCrm = {
   id_categoria:0,
    categoria:'',
    id_sub_categoria:0,
    sub_categoria:'',
    codigo_auxiliar:'',
    codigo_modelo:'',
    descripcion:'',
    precio_compra:0,
    precio_venta:0,
    lote:'',
    total_colores:0,
    total_tallas:0,
    tallas:[],
    colores:[],
    cod_tallaje:0,
    activo:1,
    nuevo_producto:true
}


export const useProductoEdicionStore = create<State>()(
    persist(
        (set, get) => ({
            producto: productoDefault,
            setProducto: (producto: IEditarProductoModeloCrm) => set({ producto }),
            resetProducto: () => set({ producto: productoDefault }),
            setEdicionProducto: (productoEditado: Partial<IEditarProductoModeloCrm>) => {
                const { producto } = get();
                set({ producto:{
                    ...producto,
                    ...productoEditado
                } })
            },
        }),
        {
            name: "producto-edicion",
        }
    ),
)