import { IRespuestaGeneralAction } from "./general.interface";

export interface IRespuestaOrdenesPendientes extends IRespuestaGeneralAction{
    ordenes:IOrdenPendiente[]
}

export interface IOrdenPendiente{
    cod_orden:number,
    cod_usuario:number,
    usuario:string,
    cedula:string,
    cargo:string,
}