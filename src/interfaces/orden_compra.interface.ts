import { CartProducto } from "./cart.interface";
import { IUsuarioEntidadResumen } from "./entidad.interface";
import { IRespuestaGeneralAction } from "./general.interface";

export interface IResponseProductoDetalleCarro {
    error: number;
    producto: IProductoMostrar;
}

export interface IResponseProductosUsuario {
    error: number;
    productos: IProductoMostrar[];
    categorias: ICategoriaUsuario[];
}

export interface ICategoriaUsuario {
    cod_categoria: number;
    cantidad: number;
    nombre: string;
}

export interface IProductoMostrar {
    cod_producto: number;
    cod_categoria: number;
    nombre: string;
    tiene_talla: number;
    tiene_color: number;
    talla: string[];
    categoria: string;
    descripcion: string;
    colores?: IColoresMostrar[];
    url_tallaje?: string
}

export interface IColoresMostrar {
    cod_producto_color: number;
    color: string;
    color_descripcion: string;
    imagenes: string[];
}

export interface IResponseValidarOrden extends IRespuestaGeneralAction {
    existe: 1 | 0,
    orden: IOrdenValidar,
    categorias: ICategoriaUsuario[],
    usuario: IUsuarioValidacion
}

export interface IUsuarioValidacion {
    cargo_entidad: string,
    cedula: string,
    entidad: string,
    nit: string,
    usuario: string,
    sexo:'M' | 'F',
    cod_usuario:number,
    coordinador:string
}

export interface IOrdenValidar {
    cod_orden: number,
    cod_usuario: number,
    fecha_creacion: string,
    fecha_creacion_local:string,
    cod_usuario_creacion: number,
    direccion?: string,
    ciudad?: string,
    productos: CartProducto[],
    usuario_creacion: string
}

export interface IResponseUsuariosGestionar extends IRespuestaGeneralAction {
    usuarios: IUsuarioGestionar[],
    gestionada:boolean,
    fecha_gestionada?:string,
    entrega_bonos?:string
}

export interface IUsuarioGestionar extends IUsuarioEntidadResumen {
    orden_completa: boolean
}
