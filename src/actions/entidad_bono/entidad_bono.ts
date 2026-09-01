import axios, { AxiosResponse } from "axios";
import { handleHttpError } from "../axios-helper/axiosError";
import { getAuthToken } from "../axios-helper/getToken";
import { actionsSettings } from "../settings";
import { IFiltroBonoBusqueda, IRespuestaBonoProductoUsuario, IRespuestaFiltroBonosBusqueda, IRespuestaReporteBonosRedimidos } from "../../interfaces/entidad_bonos.interface";
import { IRespuestaGeneralAction } from "../../interfaces/general.interface";
import { IResponseEntidadTarjetabono } from "../../interfaces/control_accesos.interface";

export const consultarBonosFiltro = async ( filtroBusqueda:IFiltroBonoBusqueda) => {
    try {
  
      let options = {
        method: 'post',
        url: actionsSettings.backendRoutes.consultarBonosFiltro,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': getAuthToken()
        },
        maxRedirects: 21,
        data:filtroBusqueda
      }
      const { data }: AxiosResponse<IRespuestaFiltroBonosBusqueda> = await axios(options);
      return data
    } catch (e) {
      handleHttpError(e);
      console.log('************')
      console.log(e)
      return null
    }
  }

  export const consultarReporteBonosRedimidos = async ( codEntidad:number) => {
    try {
  
      let options = {
        method: 'get',
        url: actionsSettings.backendRoutes.reporteBonosEntregados + '/' + codEntidad,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': getAuthToken()
        },
        maxRedirects: 21
      }
      const { data }: AxiosResponse<IRespuestaReporteBonosRedimidos> = await axios(options);
      return data
    } catch (e) {
      handleHttpError(e);
      console.log('************')
      console.log(e)
      return null
    }
  }

  export const consultarReporteBonosRedimidosTotal = async ( codEntidad:number) => {
    try {
  
      let options = {
        method: 'get',
        url: actionsSettings.backendRoutes.reporteBonosEntregadosTotal + '/' + codEntidad,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': getAuthToken()
        },
        maxRedirects: 21
      }
      const { data }: AxiosResponse<IRespuestaReporteBonosRedimidos> = await axios(options);
      return data
    } catch (e) {
      handleHttpError(e);
      console.log('************')
      console.log(e)
      return null
    }
  }

  export const consultarEntidadesEntregaBono = async () => {
    try {
  
      let options = {
        method: 'get',
        url: actionsSettings.backendRoutes.consultarEntidadesEntregaBono + '/',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': getAuthToken()
        },
        maxRedirects: 21
      }
      const { data }: AxiosResponse<IResponseEntidadTarjetabono> = await axios(options);
      return data
    } catch (e) {
      handleHttpError(e);
      console.log('************')
      console.log(e)
      return null
    }
  }

  export const consultarBonoProducto = async ( codUsuario:number) => {
    try {
  
      let options = {
        method: 'get',
        url: actionsSettings.backendRoutes.consultarBonoProducto + '/' + codUsuario,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': getAuthToken()
        },
        maxRedirects: 21
      }
      const { data }: AxiosResponse<IRespuestaBonoProductoUsuario> = await axios(options);
      return data
    } catch (e) {
      handleHttpError(e);
      console.log('************')
      console.log(e)
      return null
    }
  }

  export const redimirBono = async ( dataRedimir:{ comentario_cierre:string, cod_usuario_bono_entrega:number}) => {
    try {
  
      let options = {
        method: 'post',
        url: actionsSettings.backendRoutes.redimirBonoEntrega,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': getAuthToken()
        },
        maxRedirects: 21,
        data:dataRedimir
      }
      const { data }: AxiosResponse<IRespuestaGeneralAction> = await axios(options);
      return data
    } catch (e) {
      handleHttpError(e);
      console.log('************')
      console.log(e)
      return null
    }
  }