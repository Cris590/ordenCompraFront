import axios, { AxiosResponse } from 'axios';
import { actionsSettings } from '../settings';
import { getAuthToken } from '../axios-helper/getToken';
import { handleHttpError } from '../axios-helper/axiosError';
import { IRespuestaGeneralAction } from '../../interfaces/general.interface';
import { CrearVentaRequest, IClienteCrm, IFiltroInventarios, IFiltroLogInventarios, IFiltrosVentasPOS, IFiltroTrasladosProductos, IResponseClientePorDocumento, IResponseCreacionClientePos, IResponseCrearVentaPos, IResponseHistorialTraslados, IResponseHistorialVentas, IResponseInventariosPorCodigoPos, IResponseInventariosPos, IResponseMediosPago, IResponseMovimientoInventarios, IResponseObtenerClientesPos, IResponseProductoVentaCrm, IResponseTiendasPosUsuario, IResponseTiposDocumento, IResponseVendedoresCrm, IResponseVendedoresPorTiendaCrm, IResponseVentaDetalle, IResponseVentaRetomar } from '../../interfaces/pos.interface';

export const obtenerMediosPago = async () => {
  try {

    let options = {
      method: 'get',
      url: actionsSettings.backendRoutes.obtenerMediosPago,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthToken()
      },
      maxRedirects: 21,

    }
    const { data }: AxiosResponse<IResponseMediosPago> = await axios(options);
    return data
  } catch (e) {
    handleHttpError(e);
    console.log('************')
    console.log(e)
    return null
  }
}

export const obtenerClientePorDocumento= async (documento:string) => {
  try {

    let options = {
      method: 'get',
      url: `${actionsSettings.backendRoutes.obtenerClientePorDocumento}/${documento}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthToken()
      },
      maxRedirects: 21,

    }
    const { data }: AxiosResponse<IResponseClientePorDocumento> = await axios(options);
    return data
  } catch (e) {
    handleHttpError(e);
    console.log('************')
    console.log(e)
    return null
  }
}

export const obtenerTiendasPosUsuario= async () => {
  try {

    let options = {
      method: 'get',
      url: `${actionsSettings.backendRoutes.obtenerTiendasPosUsuario}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthToken()
      },
      maxRedirects: 21,

    }
    const { data }: AxiosResponse<IResponseTiendasPosUsuario> = await axios(options);
    return data
  } catch (e) {
    handleHttpError(e);
    console.log('************')
    console.log(e)
    return null
  }
}

export const obtenerVendedoresCrm= async () => {
  try {

    let options = {
      method: 'get',
      url: `${actionsSettings.backendRoutes.obtenerVendedoresCrm}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthToken()
      },
      maxRedirects: 21,

    }
    const { data }: AxiosResponse<IResponseVendedoresCrm> = await axios(options);
    return data
  } catch (e) {
    handleHttpError(e);
    console.log('************')
    console.log(e)
    return null
  }
}

export const obtenerVendedoresPorTiendaCrm= async () => {
  try {

    let options = {
      method: 'get',
      url: `${actionsSettings.backendRoutes.obtenerVendedoresPorTiendaCrm}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthToken()
      },
      maxRedirects: 21,

    }
    const { data }: AxiosResponse<IResponseVendedoresPorTiendaCrm> = await axios(options);
    return data
  } catch (e) {
    handleHttpError(e);
    console.log('************')
    console.log(e)
    return null
  }
}


export const obtenerInfoProductoVenta= async (codigo:string) => {
  try {

    let options = {
      method: 'get',
      url: `${actionsSettings.backendRoutes.obtenerInfoProductoVenta}/${codigo}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthToken()
      },
      maxRedirects: 21,

    }
    const { data }: AxiosResponse<IResponseProductoVentaCrm> = await axios(options);
    return data
  } catch (e) {
    handleHttpError(e);
    console.log('************')
    console.log(e)
    return null
  }
}

export const obtenerVentasPos= async (filtro:IFiltrosVentasPOS) => {
  try {

    let options = {
      method: 'post',
      url: `${actionsSettings.backendRoutes.obtenerVentas}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthToken()
      },
      maxRedirects: 21,
      data:filtro
    }
    const { data }: AxiosResponse<IResponseHistorialVentas> = await axios(options);
    return data
  } catch (e) {
    handleHttpError(e);
    console.log('************')
    console.log(e)
    return null
  }
}

export const obtenerVentaDetalle= async (idVenta:number) => {
  try {

    let options = {
      method: 'get',
      url: `${actionsSettings.backendRoutes.obtenerVentaDetalle}/${idVenta}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthToken()
      },
      maxRedirects: 21
    }
    const { data }: AxiosResponse<IResponseVentaDetalle> = await axios(options);
    return data
  } catch (e) {
    handleHttpError(e);
    console.log('************')
    console.log(e)
    return null
  }
}

export const obtenerVentaARetomar= async (idVenta:number) => {
  try {

    let options = {
      method: 'get',
      url: `${actionsSettings.backendRoutes.obtenerVentaARetomar}/${idVenta}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthToken()
      },
      maxRedirects: 21
    }
    const { data }: AxiosResponse<IResponseVentaRetomar> = await axios(options);
    return data
  } catch (e) {
    handleHttpError(e);
    console.log('************')
    console.log(e)
    return null
  }
}



export const obtenerTiposDocumento= async () => {
  try {

    let options = {
      method: 'get',
      url: `${actionsSettings.backendRoutes.obtenerTiposDocumento}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthToken()
      },
      maxRedirects: 21
    }
    const { data }: AxiosResponse<IResponseTiposDocumento> = await axios(options);
    return data
  } catch (e) {
    handleHttpError(e);
    console.log('************')
    console.log(e)
    return null
  }
}


export const crearVentaPos= async (venta:CrearVentaRequest) => {
  try {

    let options = {
      method: 'post',
      url: `${actionsSettings.backendRoutes.crearVentaPos}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthToken()
      },
      maxRedirects: 21,
      data:venta
    }
    const { data }: AxiosResponse<IResponseCrearVentaPos> = await axios(options);
    return data
  } catch (e) {
    handleHttpError(e);
    console.log('************')
    console.log(e)
    return null
  }
}

export const actualizarVentaPos= async (idVenta:number,venta:CrearVentaRequest) => {
  try {

    let options = {
      method: 'put',
      url: `${actionsSettings.backendRoutes.actualizarVentaPos}/${idVenta}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthToken()
      },
      maxRedirects: 21,
      data:venta
    }
    const { data }: AxiosResponse<IResponseCrearVentaPos> = await axios(options);
    return data
  } catch (e) {
    handleHttpError(e);
    console.log('************')
    console.log(e)
    return null
  }
}




export const generarFacturaPdf = async (idVenta: number) => {
  try {
    const response = await axios.get(
      `${actionsSettings.backendRoutes.generarFacturaPdf}/${idVenta}`,
      {
        responseType: 'blob',
        headers: {
          Authorization: getAuthToken(),
        },
      }
    );

    const blob = new Blob([response.data], {
      type: 'application/pdf',
    });

    const url = window.URL.createObjectURL(blob);

    window.open(url, '_blank');

    // Liberar la URL después de un tiempo
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 1000);

  } catch (error) {
    console.error('Error al abrir el PDF:', error);
  }
};


export const obtenerClientesCrm= async () => {
  try {

    let options = {
      method: 'get',
      url: `${actionsSettings.backendRoutes.obtenerClientesCrm}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthToken()
      },
      maxRedirects: 21
    }
    const { data }: AxiosResponse<IResponseObtenerClientesPos> = await axios(options);
    return data
  } catch (e) {
    handleHttpError(e);
    console.log('************')
    console.log(e)
    return null
  }
}

export const actualizarClientePos = async (codCliente: number,clienteParcial: Partial<IClienteCrm>) => {
  try {

    let options = {
      method: 'put',
      url: `${actionsSettings.backendRoutes.actualizarClienteCrm}/${codCliente}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthToken()
      },
      maxRedirects: 21,
      data: clienteParcial

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

export const crearClientePos = async (clienteParcial: IClienteCrm) => {
  try {

    let options = {
      method: 'post',
      url: `${actionsSettings.backendRoutes.crearClienteCrm}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthToken()
      },
      maxRedirects: 21,
      data: clienteParcial

    }
    const { data }: AxiosResponse<IResponseCreacionClientePos> = await axios(options);
    return data
  } catch (e) {
    handleHttpError(e);
    console.log('************')
    console.log(e)
    return null
  }
}


export const obtenerVentasPendientesPos= async (filtro:IFiltrosVentasPOS) => {
  try {

    let options = {
      method: 'post',
      url: `${actionsSettings.backendRoutes.obtenerVentasPendientesPos}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthToken()
      },
      maxRedirects: 21,
      data:filtro
    }
    const { data }: AxiosResponse<IResponseHistorialVentas> = await axios(options);
    return data
  } catch (e) {
    handleHttpError(e);
    console.log('************')
    console.log(e)
    return null
  }
}


export const obtenerInventariosPos= async (filtro:IFiltroInventarios) => {
  try {

    let options = {
      method: 'post',
      url: `${actionsSettings.backendRoutes.obtenerInventariosPos}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthToken()
      },
      maxRedirects: 21,
      data:filtro
    }
    const { data }: AxiosResponse<IResponseInventariosPos> = await axios(options);
    return data
  } catch (e) {
    handleHttpError(e);
    console.log('************')
    console.log(e)
    return null
  }
}





export const buscarInventarioPorCodigo= async (codigo:string) => {
  try {

    let options = {
      method: 'get',
      url: `${actionsSettings.backendRoutes.buscarInventarioPorCodigo}/${codigo}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthToken()
      },
      maxRedirects: 21
    }
    const { data }: AxiosResponse<IResponseInventariosPos> = await axios(options);
    return data
  } catch (e) {
    handleHttpError(e);
    console.log('************')
    console.log(e)
    return null
  }
}



export const obtenerProductoInventarioPorCodigoPos= async (codigo:string, idTienda:number) => {
  try {

    let options = {
      method: 'get',
      url: `${actionsSettings.backendRoutes.obtenerProductoInventarioPorCodigoPos}/${codigo}/${idTienda}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthToken()
      },
      maxRedirects: 21,
    }
    const { data }: AxiosResponse<IResponseInventariosPorCodigoPos> = await axios(options);
    return data
  } catch (e) {
    handleHttpError(e);
    console.log('************')
    console.log(e)
    return null
  }
}


export const transferirProductosEntreBodegas= async (transferencia:any) => {
  try {

    let options = {
      method: 'post',
      url: `${actionsSettings.backendRoutes.transferirProductosEntreBodegas}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthToken()
      },
      maxRedirects: 21,
      data:transferencia
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

export const obtenerHistorialTraslados= async (filtros:IFiltroTrasladosProductos) => {
  try {

    let options = {
      method: 'post',
      url: `${actionsSettings.backendRoutes.obtenerHistorialTraslados}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthToken()
      },
      maxRedirects: 21,
      data:filtros
    }
    const { data }: AxiosResponse<IResponseHistorialTraslados> = await axios(options);
    return data
  } catch (e) {
    handleHttpError(e);
    console.log('************')
    console.log(e)
    return null
  }
}


export const cancelarVentaPos= async (idVenta:number) => {
  try {

    let options = {
      method: 'get',
      url: `${actionsSettings.backendRoutes.cancelarVentaPos}/${idVenta}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthToken()
      },
      maxRedirects: 21
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

export const crearMovimientoInventario = async ( movimientoInventario:any ) => {
  try {

    let options = {
      method: 'post',
      url: `${actionsSettings.backendRoutes.crearMovimientoInventario}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthToken()
      },
      maxRedirects: 21,
      data:movimientoInventario
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

export const obtenerMovimientosInventarios = async ( filtros:IFiltroLogInventarios ) => {
  try {

    let options = {
      method: 'post',
      url: `${actionsSettings.backendRoutes.obtenerMovimientosInventarios}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthToken()
      },
      maxRedirects: 21,
      data:filtros
    }
    const { data }: AxiosResponse<IResponseMovimientoInventarios> = await axios(options);
    return data
  } catch (e) {
    handleHttpError(e);
    console.log('************')
    console.log(e)
    return null
  }
}






