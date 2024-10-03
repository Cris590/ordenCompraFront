import React, { useEffect, useState } from 'react'
import LoadingSpinnerScreen from '../../../../components/loadingSpinnerScreen/LoadingSpinnerScreen'
import { cargosPorEntidad } from '../../../../actions/entidad/entidad'
import Swal from 'sweetalert2'
import { Button, ButtonGroup } from '@mui/material'
import { FormCargoEntidad } from './FormCargoEntidad'

interface Props{
    codEntidad:number
}
export const CargosEntidad = ({ codEntidad }: Props) => {
    const [openLoadingSpinner, setLoadingSpinner] = useState<boolean>(false)
    const [cargos, setCargos] = useState<{ cod_cargo_entidad:number, nombre:string, lote:number}[]>([])
    const [cargoEntidad, setCargoEntidad] = useState(0)
    const [openFormCargoEntidad, setOpenFormCargoEntidad] = useState(false)
    useEffect(() => {
        getCargos()
    }, [codEntidad])

    const handleCrearCargo = () =>{
        setOpenFormCargoEntidad(true)
        setCargoEntidad(0)
    }

    const handleEditarCargo = ( codCargoEntidad:number) =>{
        setCargoEntidad(codCargoEntidad)
        setOpenFormCargoEntidad(true)
    }

    const onclose = (actualizar?:boolean) =>{
        if(actualizar){
            getCargos()
        }
        setOpenFormCargoEntidad(false)
    }

    const getCargos = async () => {
        try {
            setLoadingSpinner(true)
            let response = await cargosPorEntidad(+codEntidad)
            setLoadingSpinner(false)
            if (response?.error == 0 ) {
                setCargos(response.cargos)
            }else if(response?.error == 1) {
                Swal.fire(response.msg)
            }
        } catch (e) {
            Swal.fire({
                icon:'error',
                text:'Error al consultar los cargos'
            })
        }
       
    }
    
  return (
    <>  
    <div>
        <Button onClick={handleCrearCargo}>Crear Cargo</Button>

        <p className='my-6'> Cargos por entidad </p>
        <ButtonGroup variant="outlined" aria-label="Cargos">
            {
                
                cargos.map((cargo)=>(
                    <Button
                        key={cargo.cod_cargo_entidad} 
                        onClick={()=>handleEditarCargo(cargo.cod_cargo_entidad)}
                    > {cargo.nombre} - LOTE {cargo.lote}</Button>
                ))
            }
        </ButtonGroup>
        <FormCargoEntidad 
            openDialog={openFormCargoEntidad}
            onClose={onclose}
            codCargoEntidad={cargoEntidad}
            codEntidad={codEntidad}
        />
    </div>
         <LoadingSpinnerScreen open={openLoadingSpinner} />
    </>
  )
}
