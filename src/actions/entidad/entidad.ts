import axios, { AxiosResponse } from "axios";
import { handleHttpError } from "../axios-helper/axiosError";
import { getAuthToken } from "../axios-helper/getToken";
import { actionsSettings } from "../settings";
import { ICargoBonoProductoGuardar, IInformacionBasicaCargoGuardar, IInformacionBasicaEntidadGuardar, IResponseCategoriasProductoCrm, IResponseCreacionCargoEntidad, IResponseCreacionEntidad, IResponseDetalleCargoBonoProducto, IResponseDetalleCargoEntidad, IResponseEntidadResumen, IResponseGetTemplateBonoProducto, IResponseInfoContrato, IResponseInformacionBasicaEntidad, IResponseResumenCargosEntidad, IResponseResumenProductosEntidad, IResponseSaveTemplateBonoProducto, IResponseSubCategoriasAsociadasProductoCrm, IResponseSubCategoriasProductoCrm, IResponseUsuarioCoordinador, IResponseUsuariosEntidadResumen, ISubCategoriaAAsociar, ISubCategoriaASociada, ITemplateBono, IUsuarioEntidadResumen } from "../../interfaces/entidad.interface";
import { IRespuestaGeneralAction } from "../../interfaces/general.interface";

export const obtenerEntidades = async () => {
    try {
  
      let options = {
        method: 'get',
        url: actionsSettings.backendRoutes.obtenerEntidades,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': getAuthToken()
        },
        maxRedirects: 21,
  
      }
      const { data }: AxiosResponse<IResponseEntidadResumen> = await axios(options);
      return data
    } catch (e) {
      handleHttpError(e);
      console.log('************')
      console.log(e)
      return null
    }
  }

  export const crearEntidad= async (entidad: IInformacionBasicaEntidadGuardar) => {
    try {
  
      let options = {
        method: 'post',
        url: `${actionsSettings.backendRoutes.crearEntidad}`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': getAuthToken()
        },
        maxRedirects: 21,
        data: entidad
  
      }
      const { data }: AxiosResponse<IResponseCreacionEntidad> = await axios(options);
      return data
    } catch (e) {
      handleHttpError(e);
      console.log('************')
      console.log(e)
      return null
    }
  }

  export const crearCargoBonoProducto= async (cargoBono: ICargoBonoProductoGuardar) => {
    try {
  
      let options = {
        method: 'post',
        url: `${actionsSettings.backendRoutes.crearCargaBonoProducto}`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': getAuthToken()
        },
        maxRedirects: 21,
        data: cargoBono
  
      }
      const { data }: AxiosResponse<IResponseCreacionEntidad> = await axios(options);
      return data
    } catch (e) {
      handleHttpError(e);
      console.log('************')
      console.log(e)
      return null
    }
  }

  export const editarCargoBonoProducto = async (entidad: Partial<IInformacionBasicaEntidadGuardar>, codCargoBonoProducto: number) => {
    try {
  
      let options = {
        method: 'put',
        url: `${actionsSettings.backendRoutes.editarCargoEntidadProducto}/${codCargoBonoProducto}`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': getAuthToken()
        },
        maxRedirects: 21,
        data: entidad
  
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

  export const editarEntidad = async (entidad: Partial<IInformacionBasicaEntidadGuardar>, codEntidad: number) => {
    try {
  
      let options = {
        method: 'put',
        url: `${actionsSettings.backendRoutes.editarEntidad}/${codEntidad}`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': getAuthToken()
        },
        maxRedirects: 21,
        data: entidad
  
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

  export const obtenerInfoBasicaEntidad = async (codEntidad: string) => {
    try {
  
      let options = {
        method: 'get',
        url: `${actionsSettings.backendRoutes.obtenerInfoBasicaEntidad}/${codEntidad}`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': getAuthToken()
        },
        maxRedirects: 21,
  
      }
      const { data }: AxiosResponse<IResponseInformacionBasicaEntidad> = await axios(options);
      return data
    } catch (e) {
      handleHttpError(e);
      console.log('************')
      console.log(e)
      return null
    }
  }


  export const cargarUsuariosEntidad = async (form: FormData) => {
    try {
  
      let options = {
        method: 'post',
        url: actionsSettings.backendRoutes.cargarUsuariosEntidad,
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

  export const obtenerUsuariosEntidad = async (codEntidad:number) => {
    try {
  
      let options = {
        method: 'get',
        url: actionsSettings.backendRoutes.obtenerUsuariosEntidad + '/' + codEntidad,
        headers: {
          'Authorization': getAuthToken(),
          'Content-Type': 'application/json',
        }
      }
      const { data }: AxiosResponse<IResponseUsuariosEntidadResumen> = await axios(options);
      return data
    } catch (e) {
      handleHttpError(e);
      console.log('************')
      console.log(e)
      return null
    }
  }

  export const crearUsuarioEntidad = async (usuario:Partial<IUsuarioEntidadResumen>) => {
    try {
  
      let options = {
        method: 'post',
        url: actionsSettings.backendRoutes.crearUsuarioEntidad,
        headers: {
          'Authorization': getAuthToken(),
          'Content-Type': 'application/json',
        },
        data:usuario
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

  export const actualizarUsuarioEntidad = async (codUsuario:number, usuario:Partial<IUsuarioEntidadResumen> ) =>{
    try {
  
      let options = {
        method: 'put',
        url: `${actionsSettings.backendRoutes.actualizarUsuarioEntidad}/${codUsuario} ` ,
        headers: {
            'Content-Type': 'application/json',
            'Authorization':getAuthToken()
        },
        maxRedirects: 21,
        data:usuario
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

export const obtenerUsuariosCoordinador = async (codEntidad:number) => {
  try {

    let options = {
      method: 'get',
      url: actionsSettings.backendRoutes.obtenerUsuarioCoordinador + '/' + codEntidad,
      headers: {
        'Authorization': getAuthToken(),
        'Content-Type': 'application/json',
      }
    }
    const { data }: AxiosResponse<IResponseUsuarioCoordinador> = await axios(options);
    return data
  } catch (e) {
    handleHttpError(e);
    console.log('************')
    console.log(e)
    return null
  }
}

export const detalleCargoEntidad = async (codCargoEntidad: number) => {
  try {

    let options = {
      method: 'get',
      url: `${actionsSettings.backendRoutes.detalleCargoEntidad}/${codCargoEntidad}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthToken()
      },
      maxRedirects: 21,

    }
    const { data }: AxiosResponse<IResponseDetalleCargoEntidad> = await axios(options);
    return data
  } catch (e) {
    handleHttpError(e);
    console.log('************')
    console.log(e)
    return null
  }
}


export const detalleCargoBonoProducto = async (codCargoEntidad: number) => {
  try {

    let options = {
      method: 'get',
      url: `${actionsSettings.backendRoutes.detalleCargoBonoProducto}/${codCargoEntidad}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthToken()
      },
      maxRedirects: 21,

    }
    const { data }: AxiosResponse<IResponseDetalleCargoBonoProducto> = await axios(options);
    return data
  } catch (e) {
    handleHttpError(e);
    console.log('************')
    console.log(e)
    return null
  }
}


export const cargosPorEntidad = async (codEntidad: number) => {
  try {

    let options = {
      method: 'get',
      url: `${actionsSettings.backendRoutes.cargosEntidad}/${codEntidad}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthToken()
      },
      maxRedirects: 21,

    }
    const { data }: AxiosResponse<IResponseResumenCargosEntidad> = await axios(options);
    return data
  } catch (e) {
    handleHttpError(e);
    console.log('************')
    console.log(e)
    return null
  }
}

export const crearCargoEntidad= async (entidad: IInformacionBasicaCargoGuardar) => {
  try {

    let options = {
      method: 'post',
      url: `${actionsSettings.backendRoutes.crearCargo}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthToken()
      },
      maxRedirects: 21,
      data: entidad

    }
    const { data }: AxiosResponse<IResponseCreacionCargoEntidad> = await axios(options);
    return data
  } catch (e) {
    handleHttpError(e);
    console.log('************')
    console.log(e)
    return null
  }
}

export const editarCargoEntidad = async (entidad: IInformacionBasicaCargoGuardar, codCargoEntidad: number) => {
  try {

    let options = {
      method: 'put',
      url: `${actionsSettings.backendRoutes.editarCargo}/${codCargoEntidad}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthToken()
      },
      maxRedirects: 21,
      data: entidad

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


export const obtenerInfoContrato = async () => {
  try {

    let options = {
      method: 'get',
      url: `${actionsSettings.backendRoutes.infoContrato}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthToken()
      },
      maxRedirects: 21,
    }
    const { data }: AxiosResponse<IResponseInfoContrato> = await axios(options);
    return data
  } catch (e) {
    handleHttpError(e);
    console.log('************')
    console.log(e)
    return null
  }
}


export const obtenerProductosEntidadResumen = async ( codEntidad:number) => {
  try {

    let options = {
      method: 'get',
      url: `${actionsSettings.backendRoutes.resumentProductosEntidad}/${codEntidad}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthToken()
      },
      maxRedirects: 21,
    }
    const { data }: AxiosResponse<IResponseResumenProductosEntidad> = await axios(options);
    return data
  } catch (e) {
    handleHttpError(e);
    console.log('************')
    console.log(e)
    return null
  }
}


export const obtenerCategoriasProductosCrm = async () => {
  try {

    let options = {
      method: 'get',
      url: `${actionsSettings.backendRoutes.obtenerCategoriasCrm}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthToken()
      },
      maxRedirects: 21,
    }
    const { data }: AxiosResponse<IResponseCategoriasProductoCrm> = await axios(options);
    return data
  } catch (e) {
    handleHttpError(e);
    console.log('************')
    console.log(e)
    return null
  }
}

export const obtenerSubCategoriasProductosCrm = async (idCategoria:number) => {
  try {

    let options = {
      method: 'get',
      url: `${actionsSettings.backendRoutes.obtenerSubCategoriasCrm}/${idCategoria}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthToken()
      },
      maxRedirects: 21,
    }
    const { data }: AxiosResponse<IResponseSubCategoriasProductoCrm> = await axios(options);
    return data
  } catch (e) {
    handleHttpError(e);
    console.log('************')
    console.log(e)
    return null
  }
}


export const obtenerProductosAsociadosCrm = async (codCargoBonosProducto:number) => {
  try {

    let options = {
      method: 'get',
      url: `${actionsSettings.backendRoutes.obtenerProductosAsociadosCrm}/${codCargoBonosProducto}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthToken()
      },
      maxRedirects: 21,
    }
    const { data }: AxiosResponse<IResponseSubCategoriasAsociadasProductoCrm> = await axios(options);
    return data
  } catch (e) {
    handleHttpError(e);
    console.log('************')
    console.log(e)
    return null
  }
}

export const asociarSubCategoriaCargoCrm = async (dataAsociar:ISubCategoriaAAsociar) => {
  try {
    let options = {
        method: 'post',
        url: `${actionsSettings.backendRoutes.asociarSubCategoriaBonosProducto}`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': getAuthToken()
        },
        maxRedirects: 21,
        data:dataAsociar
      }
      const { data }: AxiosResponse<IResponseCreacionEntidad> = await axios(options);
      return data
    
  } catch (e) {
    handleHttpError(e);
    console.log('************')
    console.log(e)
    return null
  }
}

export const editarAsociacionSubCategoriaBonosProducto = async (asociacion: Partial<ISubCategoriaASociada>, codProductoAsociadoCategoria: number) => {
    try {
  
      let options = {
        method: 'put',
        url: `${actionsSettings.backendRoutes.editarAsociacionSubCategoriaBonosProducto}/${codProductoAsociadoCategoria}`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': getAuthToken()
        },
        maxRedirects: 21,
        data: asociacion
  
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


  
export const borrarAsociacionSubCategoriaBonosProducto = async (codProductoAsociadoCategoria: number) => {
  try {

    let options = {
      method: 'delete',
      url: `${actionsSettings.backendRoutes.borrarAsociacionSubCategoriaBonosProducto}/${codProductoAsociadoCategoria}`,
      headers: {
        'Authorization': getAuthToken(),
        'Content-Type': 'multipart/form-data'
      }
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


export const obtenerTemplateCargoBono = async (codCargoBonosProducto:number) => {
  try {

    let options = {
      method: 'get',
      url: `${actionsSettings.backendRoutes.obtenerTemplateCargoBono}/${codCargoBonosProducto}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthToken()
      },
      maxRedirects: 21,
    }
    const { data }: AxiosResponse<IResponseGetTemplateBonoProducto> = await axios(options);
    return data
  } catch (e) {
    handleHttpError(e);
    console.log('************')
    console.log(e)
    return null
  }
}


export const guardarTemplateCargoBono = async (codTemplate:number, template:ITemplateBono) => {
 try {
  
      let options = {
        method: 'put',
        url: `${actionsSettings.backendRoutes.guardarTemplateCargoBono}/${codTemplate}`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': getAuthToken()
        },
        maxRedirects: 21,
        data: template
  
      }
      const { data }: AxiosResponse<IResponseSaveTemplateBonoProducto> = await axios(options);
      return data
    } catch (e) {
      handleHttpError(e);
      console.log('************')
      console.log(e)
      return null
    }
}


export const generarBonosTemplateCargoBono = async ( codTemplate:number) => {
  try {
    const response = await axios.get(`${actionsSettings.backendRoutes.generarBonosTemplateCargoBono}/${codTemplate}`,
      {
      responseType: 'blob', // Importante para recibir archivos binarios
      headers: {
        'Authorization': getAuthToken()
      },
    });

    // Crear un enlace para descargar el archivo
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'BonosEntidad.pdf'); // Nombre del archivo
    document.body.appendChild(link);
    link.click();
  } catch (error) {
    console.error('Error al descargar el PDF:', error);
  }
};

