
import axios, { AxiosResponse } from 'axios';
import { LoginResult } from '../../interfaces/user.interfaces';
import { actionsSettings } from '../settings';


export const loginBackend = async (cedula:string, password:string) =>{
  try {

    let options = {
      method: 'post',
      url:actionsSettings.backendRoutes.login,
      headers: {
          'Content-Type': 'application/json',
      },
      maxRedirects: 21,
      data: {
         cedula,
         password
      }
  }
  const { data }: AxiosResponse<LoginResult> = await axios(options);
  return data
  } catch (e) {
    console.log('************')
    console.log(e)
    return null
  }
}