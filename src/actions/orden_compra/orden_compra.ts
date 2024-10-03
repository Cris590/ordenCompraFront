import axios, { AxiosResponse } from 'axios';
import { actionsSettings } from '../settings';
import { getAuthToken } from '../axios-helper/getToken';
import { handleHttpError } from '../axios-helper/axiosError';
import { IResponseProductoDetalleCarro, IResponseProductosUsuario, IResponseUsuariosGestionar, IResponseValidarOrden } from '../../interfaces/orden_compra.interface';
import { IRespuestaGeneralAction } from '../../interfaces/general.interface';
import { CartProducto } from '../../interfaces/cart.interface';

export const obtenerProductosUsuario = async (codUsuario:number) => {
  try {

    let options = {
      method: 'get',
      url: `${actionsSettings.backendRoutes.productosUsuario}/${codUsuario}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthToken()
      },
      maxRedirects: 21,

    }
    const { data }: AxiosResponse<IResponseProductosUsuario> = await axios(options);
    return data
  } catch (e) {
    handleHttpError(e);
    console.log('************')
    console.log(e)
    return null
  }
}

export const obtenerProductoDetalleCarro = async (codUsuario:number) => {
  try {

    let options = {
      method: 'get',
      url: `${actionsSettings.backendRoutes.obtenerProductoDetalleCarro}/${codUsuario}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthToken()
      },
      maxRedirects: 21,

    }
    const { data }: AxiosResponse<IResponseProductoDetalleCarro> = await axios(options);
    return data
  } catch (e) {
    handleHttpError(e);
    console.log('************')
    console.log(e)
    return null
  }
}

export const crearOrdenCompra = async (dataOrden: {
  cod_usuario_creacion: number;
  cod_usuario: number;
  productos: CartProducto[];
}) => {
  try {

    let options = {
      method: 'post',
      url: `${actionsSettings.backendRoutes.crearOrden}`,
      headers: {
        'Authorization': getAuthToken(),
        'Content-Type': 'application/json',
      },
      data: dataOrden
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

export const validarOrdenUsuario = async (codUsuario:number) => {
  try {

    let options = {
      method: 'get',
      url: `${actionsSettings.backendRoutes.validarOrdenUsuario}/${codUsuario}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthToken()
      },
      maxRedirects: 21,

    }
    const { data }: AxiosResponse<IResponseValidarOrden> = await axios(options);
    return data
  } catch (e) {
    handleHttpError(e);
    console.log('************')
    console.log(e)
    return null
  }
}

export const obtenerUsuariosCoordinadorGestionar = async () => {
  try {

    let options = {
      method: 'get',
      url: actionsSettings.backendRoutes.obtenerUsuariosCoordinador,
      headers: {
        'Authorization': getAuthToken(),
        'Content-Type': 'multipart/form-data'
      }

    }
    const { data }: AxiosResponse<IResponseUsuariosGestionar> = await axios(options);
    return data
  } catch (e) {
    handleHttpError(e);
    console.log('************')
    console.log(e)
    return null
  }
}
