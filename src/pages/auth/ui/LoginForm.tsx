
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { IoInformationOutline } from "react-icons/io5";
import clsx from 'clsx';
import { useUserStore } from '../../../store/user/user';
import { loginBackend } from '../../../actions/auth/login';
import { useNavigate } from 'react-router-dom';


type FormInputs = {
    cedula: string;
    password: string;
}


export const LoginForm = () => {

    const [wrongCredentials, setWronCredentials] = useState(true)
    const setSideBarMenu = useUserStore((state) => state.fullFillMenu)
    const setUser = useUserStore((state) => state.loginUser)
    const setToken = useUserStore((state) => state.setToken)
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm<FormInputs>();

    const onSubmit: SubmitHandler<FormInputs> = async (data) => {

        const { cedula, password } = data;
        
        let result = await loginBackend(cedula, password)

        if (result && result.error == 0) {
            setSideBarMenu(result.menu)
            setUser(result.user)
            setToken(result.token)

            let rutaRedirect = '/ordenes-compra'
            if (result.user.cod_perfil === 1) {
                rutaRedirect = '/entidades'
            } else if (result.user.cod_perfil === 2) {
                rutaRedirect = '/control-ordenes'
            }
            navigate(rutaRedirect);
        } else {
            setWronCredentials(false)
        }
    }



    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
            <label htmlFor="cedula">Número de documento</label>
            <input
                className="px-5 py-2 border bg-gray-200 rounded mb-5"
                type="text"
                {...register('cedula', { required: true })}
            />

            <label htmlFor="password">Contraseña</label>
            <input
                className="px-5 py-2 border bg-gray-200 rounded mb-5"
                type="password"
                {...register('password', { required: true })}
            />

            <div
                className="flex h-8 items-end space-x-1"
                aria-live="polite"
                aria-atomic="true"
            >
                {!wrongCredentials && (
                    <div className="flex flex-row mb-2">
                        <IoInformationOutline className="h-5 w-5 text-red-500" />
                        <p className="text-sm text-red-500">
                            Ups! Revise las credenciales por favor
                        </p>
                    </div>
                )}
            </div>

            <LoginButton />

        </form>
    );
};

function LoginButton() {
    const pending = false;

    return (
        <button
            type="submit"
            className={clsx({
                "btn-primary": !pending,
                "btn-disabled": pending
            })}
            disabled={pending}
        >
            Ingresar
        </button>
    );
}