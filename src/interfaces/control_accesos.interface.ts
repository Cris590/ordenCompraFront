export interface IResponseUsuariosAplicacion{
    error:number,
    usuarios:IUsuarioAplicacionResumen[]
}

export interface IUsuarioAplicacionResumen{
    cod_usuario: number,
    email: string,
    nombre: string,
    usuario: string,
    perfil: string,
    cod_perfil:number,
    password?:string
}