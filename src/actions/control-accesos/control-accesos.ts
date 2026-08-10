import axios, { AxiosResponse } from "axios";
import { handleHttpError } from "../axios-helper/axiosError";
import { getAuthToken } from "../axios-helper/getToken";
import { actionsSettings } from "../settings";
import { IResponsePerfilesAplicacion, IResponseUsuariosAplicacion, IUsuarioAplicacionResumen } from "../../interfaces/control_accesos.interface";
import { IRespuestaGeneralAction } from "../../interfaces/general.interface";

export const obtenerUsuariosAplicativo = async () => {
    try {
  
      let options = {
        method: 'get',
        url: actionsSettings.backendRoutes.usuariosAplicacion,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': getAuthToken()
        },
        maxRedirects: 21,
  
      }
      const { data }: AxiosResponse<IResponseUsuariosAplicacion> = await axios(options);
      return data
    } catch (e) {
      handleHttpError(e);
      console.log('************')
      console.log(e)
      return null
    }
}

export const editarUsuarioAplicativo = async (codUsuario:number, usuarioActualizar:IUsuarioAplicacionResumen) => {
    try {
  
      let options = {
        method: 'put',
        url:`${actionsSettings.backendRoutes.editarUsuarioAplicacion}/${codUsuario}` ,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': getAuthToken()
        },
        maxRedirects: 21,
        data: usuarioActualizar
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

export const obtenerPerfilesAplicativo = async () => {
    try {
  
      let options = {
        method: 'get',
        url:`${actionsSettings.backendRoutes.obtenerPerfilesAplicacion}` ,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': getAuthToken()
        },
        maxRedirects: 21
      }
      const { data }: AxiosResponse<IResponsePerfilesAplicacion> = await axios(options);
      return data
    } catch (e) {
      handleHttpError(e);
      console.log('************')
      console.log(e)
      return null
    }
}


export const crearUsuarioAplicativo = async (usuarioActualizar:IUsuarioAplicacionResumen) => {
    try {
  
      let options = {
        method: 'post',
        url:`${actionsSettings.backendRoutes.crearUsuarioAplicacion}` ,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': getAuthToken()
        },
        maxRedirects: 21,
        data: usuarioActualizar
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

