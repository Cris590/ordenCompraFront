import { IRespuestaGeneralAction } from "./general.interface"

export interface IResponseUsuariosAplicacion{
    error:number,
    usuarios:IUsuarioAplicacionResumen[],
    entidades:IEntidadTarjetaBono[]
}

export interface IUsuarioAplicacionResumen{
    cod_usuario: number,
    email: string,
    nombre: string,
    usuario: string,
    perfil: string,
    cod_perfil:number,
    password?:string,
    entidades:number[]
}

export interface IEntidadTarjetaBono{
    cod_entidad:number,
    nombre:string
}

export interface IResponseEntidadTarjetabono{
    error:number,
    entidades:IEntidadTarjetaBono[]
}

export interface IResponsePerfilesAplicacion extends IRespuestaGeneralAction{
    perfiles:IPerfilAplicacion[]
}

export interface IPerfilAplicacion{
    cod_perfil: number,
    nombre:string
}