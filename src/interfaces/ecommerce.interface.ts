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
    id_woo_subcategoria:number,
    sub_categoria:string,
    codigo_modelo:string,
    codigo_auxiliar:string,
    descripcion:string,
    precio_compra:number,
    precio_venta:number,
    lote:string,
    total_colores:number,
    total_tallas:number,
    nuevo_producto:boolean,
    sincronizar_ecommerce:boolean

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

export interface FiltroBusquedaPedidosEcommerce {
    documento?: string;
    numeroPedido?: string;
    codEstadoPedido?: number;
    fechaDesde?: string;
    fechaHasta?: string;
    estadoFinal?: boolean;
}

export interface IPedidoEcommerceListado {
    cod_ecommerce_pedido: number;
    id_woocommerce: number;
    numero_pedido: string;
    nombre_cliente: string;
    documento_cliente: string;
    email_cliente: string;
    telefono_cliente: string;
    direccion_envio: string;
    ciudad_envio: string;
    departamento_envio: string;
    subtotal: number;
    descuento: number;
    impuesto: number;
    envio: number;
    total: number;
    metodo_pago: string | null;
    codigo_metodo_pago: string | null;
    cod_estado_pedido: number;
    codigo_estado_pedido: string;
    descripcion_estado_pedido: string;
    estado_final: boolean;
    descripcion_ultimo_seguimiento: string | null;
    fecha_ultimo_seguimiento: string | null;
    fecha_creacion: string;
    fecha_actualizacion: string;
}

export type ICrearColorProductoCrm =
    Omit<IColorProductoCrm, "cod_producto_color" | "imagenes" | "codigo_modelo"> & {
        cod_producto_color?: number;
    };

export interface ITallaProductoCrm{
    talla:string
}




export interface IActualizarProductoColorCrm{
       codigo_color:string,
       color:string,
       nombre_color:string,
}

export interface IPedidoEcommerceGestion {
    cod_ecommerce_pedido: number;
    id_woocommerce: number;
    numero_pedido: string;
    codigo_estado_pedido:string,
    descripcion_estado_pedido:string,
    subtotal: number;
    descuento: number;
    impuesto: number;
    envio: number;
    total: number;

    metodo_pago: string | null;
    codigo_metodo_pago: string | null;

    estado_woocommerce: string;
    estado_final: boolean;
    cod_ecommerce_estado_pedido: number;

    fecha_creacion: string;
    fecha_actualizacion: string;
}

export interface IClienteEcommerceGestion {
    cod_ecommerce_cliente: number;
    id_woocommerce: number | null;

    nombre_cliente: string;
    documento: string;
    email: string;
    telefono: string;

    fecha_creacion: string;
    fecha_actualizacion: string;
}

export interface IDireccionEcommerceGestion {
    cod_ecommerce_direccion: number;

    nombre_cliente: string;
    direccion: string;
    direccion_2: string | null;
    ciudad: string;
    departamento: string;
    codigo_postal: string | null;
    telefono: string;

    fecha_creacion: string;
}

export interface ISeguimientoPedidoEcommerce {
    descripcion: string;
    codigo_estado: string;
    descripcion_estado_pedido: string;
    fecha_creacion: string;
}

export interface IEstadoPermitidoPedidoEcommerce {
    cod_ecommerce_estado_pedido:number,
    descripcion: string;
    codigo: string;
    estado_woocommerce: string;
    estado_final: boolean;
}

export interface IProductoPedidoEcommerce {
    categoria: string;
    sub_categoria: string;
    codigo: string;
    descripcion: string;
    color: string | null;
    talla: string | null;
    cod_producto_color: number | null;
    nombre_color: string | null;
    codigo_color: string | null;
    color_rgb: string | null;
    precio_crm: number;
    imagenes: string[];
    cantidad: number;
    precio: number;
    descuento: number;
    impuesto: number;
    total: number;
}

export interface ITransaccionPedidoEcommerce {
    id_transaccion: string;
    metodo_pago: string;
    estado: string;
    monto: number;
}

export interface IGestionPedidoEcommerce {
    pedido: IPedidoEcommerceGestion;
    cliente: IClienteEcommerceGestion | null;
    direccionFacturacion: IDireccionEcommerceGestion | null;
    direccionEnvio: IDireccionEcommerceGestion | null;
    seguimientos: ISeguimientoPedidoEcommerce[];
    estadosPermitidos: IEstadoPermitidoPedidoEcommerce[];
    productos:IProductoPedidoEcommerce[],
    transactions:ITransaccionPedidoEcommerce[]
}

export interface IInventarioDisponibleTienda {
    id_tienda: number;
    nombre_tienda: string;
    cantidad_disponible: number;
}

export interface IInventarioDisponibleProducto {
    codigo_producto: string;
    cantidad_pedida: number;
    tiendas: IInventarioDisponibleTienda[];
}

/** Respuestas APIS */

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


export interface IResponseListadoPedidosEcommerce extends IRespuestaGeneralAction{
    data: IPedidoEcommerceListado[],
    pagination: {
        page: number,
        perPage: number,
        count: number,
        total: number,
        totalPages: number,
        hasNext: boolean,
        hasPrevious: boolean
    }
}

export interface IResponseGestionarPedidoEcommerce extends IRespuestaGeneralAction, IGestionPedidoEcommerce {}


export interface IInventarioDisponibleTienda {
    id_tienda: number;
    nombre_tienda: string;
    cantidad_disponible: number;
}

export interface IInventarioDisponibleProducto {
    codigo_producto: string;
    cantidad_pedida: number;
    descripcion:string;
    id_producto:number,
    tiendas: IInventarioDisponibleTienda[];
}

export interface IResponseInventarioDisponibleTienda extends IRespuestaGeneralAction{
    inventario:IInventarioDisponibleProducto[]
}

export interface IAsignacionTienda{
    id_tienda: number, 
    cantidad: number
}
export interface IAsignacionNuevoInventario{
    id_producto: number,
    asignaciones: IAsignacionTienda[]
}

export interface INuevoSeguimientoPedidoEcommerce{    
    cod_ecommerce_pedido: number,
    cod_ecommerce_estado_pedido: number,
    descripcion: string,
    inventario: IAsignacionNuevoInventario[] | []
}  