import { IRespuestaGeneralAction } from "./general.interface";

export interface IFiltrosRedencionBonosTienda{
  id_tienda: string;
  fecha_inicial: string;
  fecha_final: string;
  documento_cliente: string;
}

 export interface IBonoRedimidosResumen {
    cod_redencion_bono_tienda:number,
    bonos: object;
    metodos_pago: object ;
    productos: object ;
    subtotal: number;
    descuento: number;
    total_pagado: number;
    documento_usuario: string;
    nombre_usuario: string;
    documento_cliente: string ;
    nombre_cliente: string ;
    fecha_creacion:string;
    tienda:string;
    total_productos:number,
    total_bonos:number
}


export interface IUsuarioBonoRedimido {
    codigo: string;
}

export interface IDetalleBonoRedimido {
    cod_usuario_bono_entrega: number;
    cargo_bono_producto: string;
    descripcion_bono_producto: string;
    cargo_entidad: string;
    nombre: string;
    descripcion: string;
    valor: string;
    codigo_bono: string;
    cod_cargo_entidad:number
}

export interface IMetodoPagoBonoRedimido {
    id_metodo_pago: number;
    valor: number;
    nombre: string;
    codigo: string;
    activo: number;
    necesita_codigo: string;
}

export interface IProductoBonoRedimido {
    id: number;
    codigo: string;
    precio: number;
    stock: number;
    nombre: string;
    costo: number;
    cantidad: number;
}

export interface IBonoRedimidoDetalle {
    cod_redencion_bono_tienda: number;
    documento: string;

    bonos: IDetalleBonoRedimido[];
    metodos_pago: IMetodoPagoBonoRedimido[];
    productos: IProductoBonoRedimido[];

    subtotal: number;
    total: number;
    impuesto: number;
    descuento: number;
    total_pagado: number;
    cambio: number;

    cod_usuario: number;
    cod_entidad: number;
    id_tienda: number;

    fecha_creacion: string;
    fecha_actualizacion: string;

    documento_usuario: string;
    nombre_usuario: string;
    documento_cliente: string;
    nombre_cliente: string;

    entidad: string;
    no_contrato: string;
    nit: string;
    tienda: string;

    total_productos: number;
    usuarios: IUsuarioBonoRedimido[];
}


export interface IResponseBonosRedimidosTienda extends IRespuestaGeneralAction{
  bonosRedimidos:IBonoRedimidosResumen[]
}


export interface IResponseBonoDetalleRedimidoTienda extends IRespuestaGeneralAction{
  bonoDetalle:IBonoRedimidoDetalle
}

