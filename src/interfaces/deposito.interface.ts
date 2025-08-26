import dayjs, { Dayjs } from 'dayjs';

export  interface IDepositoInfo{
    cod_deposito:number,
    nombre:string;
    valor:number;
    no_cuenta:string;   
}

export interface IMovimientoDeposito{
    cod_movimiento:number,
    concepto:string,
    no_factura:string,
    documento_cliente:string,
    fecha_creacion:string,
    entrada_saldo:boolean,
    valor:number,
    url:string

}

export interface IFiltroMovimientos{
    fecha_inicio: Dayjs,
    fecha_fin:Dayjs,
    cod_concepto:number,
    documento_cliente:string    

}
