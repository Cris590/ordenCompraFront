import { Link } from "react-router-dom";
import { formatDate } from "../../../utils/formatDate";

export const Footer = () => {
  return (
    <div className="flex w-full justify-center text-sm mb-10">

     

      <div className="flex flex-col mx-4">
      <Link
        to='/'
      >
        <span className={`antialiased font-bold `}>Inversiones BRT</span>
        <span> Ordenes </span>
        <span>© {new Date().getFullYear()}</span>
      </Link>

        <br/>
        <p>Direccion de la empresa</p>
        <p>Carrera 18 No° 16-44 sur piso 3</p>
        <br/>
        <p> <span className="font-bold">Fecha Actualizacion</span> {formatDate(process.env.REACT_APP_LAST_UPDATE || '2024-09-19T14:59:54')}</p>
      </div>

      <div className="flex flex-col mx-4 max-w-sm">
        <p>En caso de presentarse alguna dificultad relacionada con la operación de la plataforma o la ejecución de la orden de entrega, puede comunicarse con nuestro equipo de soporte a través de los siguientes datos de contacto. Este servicio está disponible de lunes a sábado, de 08:00 a.m. a 04:00 p.m.</p>
        <p>Número de contacto: <span className="font-bold">323 219 4970</span> y <span className="font-bold"> 601 455 9328 </span></p>
        <p>Correo: <span className="font-bold"> servicioclienteinversionesbrt@gmail.com</span></p>
        <p>Estamos a su disposición para brindarle la asistencia necesaria</p>
      </div>

      


    </div>
  )
}