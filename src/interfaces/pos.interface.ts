import { IRespuestaGeneralAction } from "./general.interface";

export interface Cliente {
  id: number;
  documento: string;
  nombre: string;
  dv?: number
}

export interface Vendedor {
  id: number;
  nombre: string;
}

export interface Producto {
  id: number;
  codigo: string;
  nombre: string;
  precio: number;
  stock: number;
  costo:number
}

export interface ProductoVenta extends Producto {
  cantidad: number;
 
}

export interface MedioPago {
  id_metodo_pago: number;
  nombre: string;
  valor: number;
}



/**
 * Producto que se enviará al backend
 * al registrar la venta.
 */
export interface ProductoVentaRequest {
  id: number;
  descripcion: string;
  cantidad: number;
  stock: number;
  precio: number;
  total: number;
}

/**
 * Medio de pago que se enviará al backend.
 */
export interface PagoVentaRequest {
  metodo_pago: string;
  valor: number;
}

/**
 * Información enviada al backend
 * para registrar una venta.
 */
export interface CrearVentaRequest {
  clienteId: number;
  vendedorId: number;
  productos: ProductoVentaRequest[];
  descuento: number;
  neto: number;
  impuesto: number;
  total: number;
  costos: number;
  pagos: PagoVentaRequest[];
  deuda: number;
}


export interface IVendedorCrm {
  id: number, nombre: string, usuario: string
}

export interface IVendedorCrmTienda {
  cod_vendedor: number;
  cod_usuario: number;
  id_usuario_crm: number;
  id_bodega: number;
  nombre: string;
  cedula: string;
}
export interface IVentaPOSAdmin {
  id: number;
  codigo: number | string;
  id_cliente: number;
  cliente: string;
  documento_cliente: string;
  id_vendedor: number;
  vendedor: string;
  id_tienda: number;
  tienda: string;
  neto: number;
  total: number;
  deuda:number;
  metodo_pago: string;
  fecha: string;
  factura_valida: number;
  fc: number;
}
export interface IFiltrosVentasPOS {
  id_tienda: string;
  fecha_inicial: string;
  fecha_final: string;
  documento_cliente: string;
}

export interface IFiltroInventarios {
  id_tienda: number[];
}

export interface IProductoVentaPOS {
    codigo: string;
    descripcion: string;
    cantidad: string;
    precio: string;
    total: string;
}

export interface IVentaDetallePOS {
    productos: IProductoVentaPOS[];
    metodo_pago: PagoVentaRequest[];
    codigo: string;
    fecha: string;
    pago_bono: string;
    neto: string;
    impuesto: string;
    total: string;
    factura_valida: string;
    descuento: string;
    cliente: string;
    id_cliente:number,
    dv:number,
    documento_cliente: string;
    sufijo: string;
    tipo_documento: string;
    usuario: string;
    tienda: string;
    bono: string | null;
    total_sin_descuento: string;
    total_productos: number;
}

export interface IClienteCrm {
  id:number,
  nombre:string,
  id_tipo_documento:number,
  documento:string,
  dv:number,
  email:string,
  telefono:string,
  direccion:string,
  fecha_nacimiento:string,
  compras:number,
  ultima_compra:string,
  fecha:string,
  id_tienda:number,
  origen:string,
  id_usuario:number
}

export interface IClienteTablaCrm extends IClienteCrm{
  tipo_documento:string,
  bodega:string
}


export interface ITipoDocumento{
  id:number,
  sufijo:string,
  descripcion:string,
  fe_tipodoc:number
}

export interface IInventarioProducto{
  id:number,
  codigo:string,
  descripcion:string,
  cantidad:string,
  id_bodega:number,
  bodega:string,
  categoria:string,
  sub_categoria:string
}
/**
 * Response de apis 
 */

export interface IResponseMediosPago extends IRespuestaGeneralAction {
  metodosPago: MedioPago[]
}
export interface IResponseClientePorDocumento extends IRespuestaGeneralAction {
  cliente: Cliente[]
}

export interface IResponseTiendasPosUsuario extends IRespuestaGeneralAction {
  bodegas: { id: number, nombre: string}[],
  idTiendaObligatorio?:number
}

export interface IResponseVendedoresCrm extends IRespuestaGeneralAction {
  vendedores: IVendedorCrm[]
}

export interface IResponseVendedoresPorTiendaCrm extends IRespuestaGeneralAction {
  vendedores: IVendedorCrmTienda[],
  codigoNuevo:number
}

export interface IResponseProductoVentaCrm extends IRespuestaGeneralAction {
  producto: Producto
}

export interface IResponseHistorialVentas extends IRespuestaGeneralAction {
  ventas: IVentaPOSAdmin[]
}

export interface IResponseVentaDetalle extends IRespuestaGeneralAction {
  venta:IVentaDetallePOS
}

export interface IResponseCrearVentaPos extends IRespuestaGeneralAction {
  ventaId:number
}

export interface IResponseObtenerClientesPos extends IRespuestaGeneralAction {
  clientes:IClienteTablaCrm[]
}

export interface IResponseObtenerClientesPos extends IRespuestaGeneralAction {
  idCliente:number,
  documento:string
}

export interface IResponseTiposDocumento extends IRespuestaGeneralAction {
  tiposDocumento:ITipoDocumento[]
}

export interface IResponseCreacionClientePos extends IRespuestaGeneralAction {
   idCliente:number,
  documento:string
}

export interface IResponseVentaRetomar extends IRespuestaGeneralAction {
  descuento:number,
  productos:ProductoVenta[],
  cliente:Cliente,
  vendedor:IVendedorCrmTienda,
  mediosPago:MedioPago[]
}


export interface IResponseInventariosPos extends IRespuestaGeneralAction{
  inventarios:IInventarioProducto[]
}

export interface IProductoTraslado {
    id: number | null;
    codigo: string;
    descripcion: string;
    cantidadDisponible: number;
    cantidadTransferir:number
}

export interface IResponseInventariosPorCodigoPos extends IRespuestaGeneralAction{ 
    producto:IProductoTraslado
}



