import { IRespuestaGeneralAction } from "./general.interface";

export interface IResponseCreacionCategoriaCRM extends IRespuestaGeneralAction{
    id:number
}



export interface ICategoriaCrm{
    id?:number,
    categoria:string,
}

export interface ISubCategoriaCrm{
    id?:number,
    id_categoria:number,
    sub_categoria:string,
}

export interface IProductoResumenCrm{
    id_categoria:number,
    categoria:string,
    id_sub_categoria:number,
    sub_categoria:string,
    codigo_modelo:string,
    codigo_auxiliar:string,
    descripcion:string,
    precio_compra:number,
    precio_venta:number,
    lote:string,
    total_colores:number,
    total_tallas:number,
    nuevo_producto:boolean

}

export interface IPaginationProductoCRM {
    page: number;
    perPage: number;
    count: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
}

export interface IPaginatedProductsCrmResponse extends IRespuestaGeneralAction{
    data: IProductoResumenCrm[];
    pagination: IPaginationProductoCRM;
}

export interface IFiltroProductosCRM {
    buscar: string;
    idCategoria?: number;
    idSubCategoria?: number;
}

export interface IImagenColorProducto{
    principal?:number,
    url:string,
    orden:number
}

export interface IColorProductoCrm{
    cod_producto_color:number,
    codigo_modelo:string,
    codigo_color:string,
    color:string,
    nombre_color:string,
    imagenes:IImagenColorProducto[]
}
export type ICrearColorProductoCrm =
    Omit<IColorProductoCrm, "cod_producto_color" | "imagenes" | "codigo_modelo"> & {
        cod_producto_color?: number;
    };

export interface ITallaProductoCrm{
    talla:string
}

export interface IRespuestaDetalleProducto extends IRespuestaGeneralAction{
    tallas: ITallaProductoCrm[],
    colores:IColorProductoCrm[]
}

export interface IRespuestaColorProducto extends IRespuestaGeneralAction{
    coloresParaCrear: string[],
    colores:IColorProductoCrm[]
}

export interface IResponseCrearColorProductoCRM extends IRespuestaGeneralAction{
    id:number
}

export interface IActualizarProductoColorCrm{
       codigo_color:string,
       color:string,
       nombre_color:string,
}

export interface IResponseTallasProductoCrm extends IRespuestaGeneralAction{   
    tallas:string[],
    cod_tallaje:number,
}

export interface IEditarProductoModeloCrm extends IProductoResumenCrm{
  colores: string[];
  tallas: string[];
  activo:number,
  cod_tallaje:number
}