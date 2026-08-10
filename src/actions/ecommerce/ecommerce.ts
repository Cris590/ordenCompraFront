import axios, { AxiosResponse } from "axios";
import { handleHttpError } from "../axios-helper/axiosError";
import { getAuthToken } from "../axios-helper/getToken";
import { actionsSettings } from "../settings";
import { IRespuestaGeneralAction } from "../../interfaces/general.interface";
import { IActualizarProductoColorCrm, IColorProductoCrm, ICrearColorProductoCrm, IFiltroProductosCRM, IPaginatedProductsCrmResponse, IResponseCreacionCategoriaCRM, IResponseCrearColorProductoCRM, IResponseTallasProductoCrm, IRespuestaColorProducto, IRespuestaDetalleProducto } from "../../interfaces/ecommerce.interface";
import { IResponseColorImagenes } from "../../interfaces/producto.interface";
import { ITallajeResumenResponse } from "../../interfaces/tallaje.interface";


export const crearCategoriaCRM = async (categoria: { categoria: string }) => {
  try {

    let options = {
      method: 'post',
      url: `${actionsSettings.backendRoutes.crearCategoriaCRM}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthToken()
      },
      data: categoria,
      maxRedirects: 21,

    }
    const { data }: AxiosResponse<IResponseCreacionCategoriaCRM> = await axios(options);
    return data
  } catch (e) {
    handleHttpError(e);
    console.log('************')
    console.log(e)
    return null
  }
}

export const editarCategoriaCRM = async (codCategoria: number, categoria: { categoria: string }) => {
  try {

    let options = {
      method: 'put',
      url: `${actionsSettings.backendRoutes.editarCategoriaCRM}/${codCategoria}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthToken()
      },
      data: categoria,
      maxRedirects: 21,

    }
    const { data }: AxiosResponse<IResponseCreacionCategoriaCRM> = await axios(options);
    return data
  } catch (e) {
    handleHttpError(e);
    console.log('************')
    console.log(e)
    return null
  }
}

export const crearSubCategoriaCRM = async (subcategoria: { id_categoria: number, sub_categoria: string }) => {
  try {

    let options = {
      method: 'post',
      url: `${actionsSettings.backendRoutes.crearSubCategoriaCRM}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthToken()
      },
      data: subcategoria,
      maxRedirects: 21,

    }
    const { data }: AxiosResponse<IResponseCreacionCategoriaCRM> = await axios(options);
    return data
  } catch (e) {
    handleHttpError(e);
    console.log('************')
    console.log(e)
    return null
  }
}

export const editarSubCategoriaCRM = async (codSubCategoria: number, categoria: { sub_categoria: string }) => {
  try {

    let options = {
      method: 'put',
      url: `${actionsSettings.backendRoutes.editarSubCategoriaCRM}/${codSubCategoria}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthToken()
      },
      data: categoria,
      maxRedirects: 21,

    }
    const { data }: AxiosResponse<IResponseCreacionCategoriaCRM> = await axios(options);
    return data
  } catch (e) {
    handleHttpError(e);
    console.log('************')
    console.log(e)
    return null
  }
}

export const sincronizarCategoriaEcommerce = async (codCategoria: number) => {
  try {

    let options = {
      method: 'get',
      url: `${actionsSettings.backendRoutes.sincronizarCategoriaEcommerce}/${codCategoria}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthToken()
      },
      maxRedirects: 21,

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

export const sincronizarSubCategoriaEcommerce = async (codSubCategoria: number) => {
  try {

    let options = {
      method: 'get',
      url: `${actionsSettings.backendRoutes.sincronizarSubCategoriaEcommerce}/${codSubCategoria}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthToken()
      },
      maxRedirects: 21,

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

export const obtenerProductosCrm = async (page: number, pp: number, filtros: IFiltroProductosCRM) => {
  try {

    let options = {
      method: 'get',
      url: `${actionsSettings.backendRoutes.obtenerProductosCrm}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthToken()
      },
      params: {
        page,
        pp,
        ...filtros
      },
      maxRedirects: 21,

    }
    const { data }: AxiosResponse<IPaginatedProductsCrmResponse> = await axios(options);
    return data
  } catch (e) {
    handleHttpError(e);
    console.log('************')
    console.log(e)
    return null
  }
}

export const obtenerDetalleProductoCrm = async (codigoModelo: string) => {
  try {

    let options = {
      method: 'get',
      url: `${actionsSettings.backendRoutes.obtenerDetalleProductoCrm}/${codigoModelo}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthToken()
      },
      maxRedirects: 21,
    }
    const { data }: AxiosResponse<IRespuestaDetalleProducto> = await axios(options);
    return data
  } catch (e) {
    handleHttpError(e);
    console.log('************')
    console.log(e)
    return null
  }
}



export const obtenerColoresProductoCrm = async (codigoModelo: string) => {
  try {

    let options = {
      method: 'get',
      url: `${actionsSettings.backendRoutes.obtenerColoresProductoCrm}/${codigoModelo}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthToken()
      },
      maxRedirects: 21,
    }
    const { data }: AxiosResponse<IRespuestaColorProducto> = await axios(options);
    return data
  } catch (e) {
    handleHttpError(e);
    console.log('************')
    console.log(e)
    return null
  }
}


export const crearColorProductoCrm = async (nuevoColor: ICrearColorProductoCrm, codigoModelo:string) => {
  try {
    const dataColor = {
      ...nuevoColor,
      codigo_modelo:codigoModelo
    }

    let options = {
      method: 'post',
      url: `${actionsSettings.backendRoutes.crearColorProductoCrm}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthToken()
      },
      data:dataColor,
      maxRedirects: 21,
    }
    const { data }: AxiosResponse<IResponseCrearColorProductoCRM> = await axios(options);
    return data
  } catch (e) {
    handleHttpError(e);
    console.log('************')
    console.log(e)
    return null
  }
}



export const editarColorProductoCrm = async (idColorProducto: number, color:IActualizarProductoColorCrm) => {
  try {

    let options = {
      method: 'put',
      url: `${actionsSettings.backendRoutes.actualizarColorProductoCrm}/${idColorProducto}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthToken()
      },
      data: color,
      maxRedirects: 21,

    }
    const { data }: AxiosResponse<IResponseCreacionCategoriaCRM> = await axios(options);
    return data
  } catch (e) {
    handleHttpError(e);
    console.log('************')
    console.log(e)
    return null
  }
}


export const obtenerImagenesColoresProductoCrm = async (codProductoColor: number | string) => {
  try {

    let options = {
      method: 'get',
      url: `${actionsSettings.backendRoutes.obtenerImagenesColoresCrm}/${codProductoColor}`,
      headers: {
        'Authorization': getAuthToken(),
        'Content-Type': 'multipart/form-data'
      }
    }
    const { data }: AxiosResponse<IResponseColorImagenes> = await axios(options);
    return data
  } catch (e) {
    handleHttpError(e);
    console.log('************')
    console.log(e)
    return null
  }
}

export const subirImagenProductoCrm = async (form: FormData) => {
  try {
    let options = {
      method: 'post',
      url: actionsSettings.backendRoutes.subirImagenCrm,
      headers: {
        'Authorization': getAuthToken(),
        'Content-Type': 'multipart/form-data'
      },
      data: form

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

export const borrarImagenProductoCrm = async (dataImagen: { cod_producto_color_imagen: number | string, url: string }) => {
  try {

    let options = {
      method: 'post',
      url: `${actionsSettings.backendRoutes.borrarImagenCrm}`,
      headers: {
        'Authorization': getAuthToken(),
        'Content-Type': 'multipart/form-data'
      },
      data: dataImagen
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


export const obtenerTallasProductoCrm = async (codProducto: string) => {
  try {

    let options = {
      method: 'get',
      url: `${actionsSettings.backendRoutes.obtenerTallasProductoCrm}/${codProducto}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthToken()
      },
      maxRedirects: 21,

    }
    const { data }: AxiosResponse<IResponseTallasProductoCrm> = await axios(options);
    return data
  } catch (e) {
    handleHttpError(e);
    console.log('************')
    console.log(e)
    return null
  }
}

export const obtenerTallajesCrm = async () => {
  try {

    let options = {
      method: 'get',
      url: actionsSettings.backendRoutes.obtenerTallajesCrm,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthToken()
      },
      maxRedirects: 21,

    }
    const { data }: AxiosResponse<ITallajeResumenResponse> = await axios(options);
    return data
  } catch (e) {
    handleHttpError(e);
    console.log('************')
    console.log(e)
    return null
  }
}


export const obtenerTallajesActivosCrm = async () => {
  try {

    let options = {
      method: 'get',
      url: actionsSettings.backendRoutes.obtenerTallajesActivosCrm,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthToken()
      },
      maxRedirects: 21,

    }
    const { data }: AxiosResponse<ITallajeResumenResponse> = await axios(options);
    return data
  } catch (e) {
    handleHttpError(e);
    console.log('************')
    console.log(e)
    return null
  }
}



export const crearTallajeCrm = async (form: FormData) => {
  try {

    let options = {
      method: 'post',
      url: actionsSettings.backendRoutes.crearTallajeCrm,
      headers: {
        'Authorization': getAuthToken(),
        'Content-Type': 'multipart/form-data'
      },
      data: form

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

export const editarTallajeCrm = async (form: FormData, codTallaje:number) => {
  try {

    let options = {
      method: 'put',
      url: `${actionsSettings.backendRoutes.editarTallajecrm}/${codTallaje}`,
      headers: {
        'Authorization': getAuthToken(),
        'Content-Type': 'multipart/form-data'
      },
      data: form

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


export const editarProductoCrm = async (producto: any) => {
  try {
    

    let options = {
      method: 'post',
      url: `${actionsSettings.backendRoutes.editarProductoCrm}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthToken()
      },
      data:producto,
      maxRedirects: 21,
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


export const crearProductoCrm = async (producto: any) => {
  try {
  
    let options = {
      method: 'post',
      url: `${actionsSettings.backendRoutes.crearProductoCrm}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthToken()
      },
      data:producto,
      maxRedirects: 21,
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









