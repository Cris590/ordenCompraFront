import { IRespuestaGeneralAction } from "./general.interface"

export interface IUsuarioBonoBusqueda{
    cod_usuario:number,
    nombre:string,
    cedula:string,
    sexo:'F' | 'M',
    entidad:string,
    cargo_entidad:string,
    no_contrato:string,
    nit:string,
    redimido:boolean,
    codigo:string
    
}

export interface IRespuestaFiltroBonosBusqueda extends IRespuestaGeneralAction{
    usuarios:IUsuarioBonoBusqueda[]
}

export interface IFiltroBonoBusqueda{
    codigo?:number,
    nombre?:string,
    cedula?:string,
    nit?:string,
    cod_entidad?:number,
    no_contrato?:string
    
}

export interface IRespuestaBonoProductoUsuario extends IRespuestaGeneralAction{
    bonos:IBonoProductoUsuario[]
}

export interface IBonoProductoUsuario{
    cod_usuario_bono_entrega: number,
    nombre:string,
    descripcion:string,
    valor:number,
    redimido:boolean,
    fecha_redimido:string,
    comentario_cierre:string,
    cedula_vendedor:string,
    nombre_vendedor:string,
    tienda:string
}

export interface IRespuestaReporteBonosRedimidos extends IRespuestaGeneralAction{
    usuarios:IBonoRedimido[]
}

export interface IBonoRedimido{
    activo:1|0;
    fecha_redimido:string,
    comentario_cierre:string,
    cedula_vendedor:string,
    nombre_vendedor:string,
    tienda:string,
    sexo:'F' | 'M',    
    nombre:string,
    cedula:string,
    codigo:boolean,
    valor:string,
    descripcion:string,
    entidad: string,
    no_contrato:string

}