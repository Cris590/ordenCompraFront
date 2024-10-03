import { IRespuestaGeneralAction } from "./general.interface"

export interface IEntidadResumen {
    cod_entidad:number,
    nombre:string,
    activo:1|0,
    nit:string,
    gestionada:1|0,
    fecha_gestionada?:string,
    entrega_bonos:string
}

export interface IResponseEntidadResumen {
    error:number,
    entidades:IEntidadResumen[]
}

export interface IInformacionBasicaEntidad {
    nombre:string,
    activo:1|0,
    nit:string,
    info_contrato:string,
    no_contrato:string,
    fecha_inicio:string,
    fecha_final:string
}

export interface IInformacionBasicaEntidadGuardar {
    nombre:string,
    activo:1|0,
    nit:string,
    info_contrato:string,
    no_contrato:string,
    fecha_inicio:string,
    fecha_final:string,
    entrega_bonos?:'FISICO' | 'VIRTUAL',
    fecha_gestionada?:string

}

export interface IResponseCreacionEntidad extends IRespuestaGeneralAction{
    cod_entidad:number
}

export interface IResponseCreacionCargoEntidad extends IRespuestaGeneralAction{
    cod_cargo_entidad:number
}

export interface IResponseInformacionBasicaEntidad{
    error:number,
    entidad:IInformacionBasicaEntidadGuardar
}

export interface IResponseUsuariosEntidadResumen extends IRespuestaGeneralAction{
    usuarios:IUsuarioEntidadResumen[],
    gestionada:1|0
}

export interface IResponseUsuarioCoordinador extends IRespuestaGeneralAction{
    usuario:IUsuarioEntidadResumen | null
}

export interface IUsuarioEntidadResumen{
    cod_usuario:number,
    email:string,
    nombre:string,
    activo:1|0,
    sexo:'M' | 'F',
    cedula:string,
    password?:string,
    cod_orden?:number,
    cod_cargo_entidad:number,
    cargo_entidad?:string
}   

export interface IResponseResumenCargosEntidad extends IRespuestaGeneralAction{
    cargos:{ cod_cargo_entidad:number, nombre:string, lote:number }[]
}

export interface ICargoEntidadDetalle {
    cod_cargo_entidad:number,
    nombre:string,
    cod_entidad:number,
    lote:number,
    cod_categorias:{cod_categoria:number , cantidad:number}[],
}

export interface IResponseDetalleCargoEntidad{
    error:1| 0
    cargo:ICargoEntidadDetalle
}

export interface IInformacionBasicaCargoGuardar {
    nombre:string,
    cod_entidad:number,
    cod_categorias:{cod_categoria:number , cantidad:number}[]
}
    
export interface IResponseInfoContrato extends IRespuestaGeneralAction{
    info:IInfoContratoEntidad
}

export interface IInfoContratoEntidad{
    cod_entidad:string, 
    nombre:string,
    nit:string,
    info_contrato:string,
    no_contrato:string,
    fecha_inicio:string,
    fecha_final:string, 
    gestionada:string,
    fecha_gestionada?:string,
    entrega_bonos?:'FISICO' | 'VIRTUAL',
    no_orden?:string,
    direccion:string,
    ciudad:string
}