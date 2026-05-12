import React, { useEffect, useRef, useState } from 'react'
import Swal from 'sweetalert2'
import { cargosPorEntidad, detalleCargoEntidad, obtenerProductosAsociadosCrm } from '../../../../../actions/entidad/entidad'
import { Box, Button, ButtonGroup, Divider, Grid } from '@mui/material'
import { ICargoBonoProducto, ISubCategoriaASociada, ISubCategoriaProductoCrm } from '../../../../../interfaces/entidad.interface'
import LoadingSpinnerScreen from '../../../../../components/loadingSpinnerScreen/LoadingSpinnerScreen'
import { currencyFormat } from '../../../../../utils/currencyFormat'
import { TablaCategoriasProductos } from './TablaCategoriasProductos'
import { CardSubCategoria } from './CardSubCategoria'
interface Props {
    codEntidad: number
}

export const ControlProductosEntidad = ({ codEntidad }: Props) => {
    const [openLoadingSpinner, setLoadingSpinner] = useState<boolean>(false)
    const [cargos, setCargos] = useState<{ cod_cargo_entidad: number, nombre: string, lote: number }[]>([])
    const [cargosProductos, setCargosProductos] = useState<ICargoBonoProducto[]>([])
    const [selectedCargosProductos, setSelectedCargosProductos] = useState<ICargoBonoProducto | null>()
    const [subCategoriasAsociados, setSubCategoriasAsociados] = useState<ISubCategoriaASociada[]>([])
    const [nuevaSubCategoriaAsociar, setNuevaSubCategoriaAsociar] = useState<ISubCategoriaASociada>({ cod_subcategoria: 0, nombre: '', valor: 0 })
    const [open, setOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);


    useEffect(() => {
        if (open) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 0);
        }
    }, [open,nuevaSubCategoriaAsociar]);
    useEffect(() => {
        getCargos()
    }, [codEntidad])

    const getCargos = async () => {
        try {
            setLoadingSpinner(true)
            let response = await cargosPorEntidad(+codEntidad)
            setLoadingSpinner(false)
            if (response?.error == 0) {
                setCargos(response.cargos)
            } else if (response?.error == 1) {
                Swal.fire(response.msg)
            }
        } catch (e) {
            Swal.fire({
                icon: 'error',
                text: 'Error al consultar los cargos'
            })
        }

    }

    const handleObtenerDetalleCargo = async (codCargoEntidad: number) => {
        try {
            setSelectedCargosProductos(null)
            setCargosProductos([])
            setLoadingSpinner(true)
            let response = await detalleCargoEntidad(codCargoEntidad)
            setLoadingSpinner(false)
            if (response?.error === 0 && response.cargo.cod_cargo_bonos_producto) {
                setCargosProductos(response.cargo.cod_cargo_bonos_producto)
            } else {
                setCargosProductos([])
            }
        } catch (e) {
            Swal.fire({
                icon: 'error',
                text: 'Error al obtener detalles del cargo'
            })
        }

    }

    const handleAsociarProductosBonoProducto = async (cargoBonoProducto: ICargoBonoProducto) => {
        try {
            setSelectedCargosProductos(cargoBonoProducto)
            setLoadingSpinner(true)
            let response = await obtenerProductosAsociadosCrm(cargoBonoProducto.cod_cargo_bonos_producto)
            setLoadingSpinner(false)
            if (response?.error === 0 && response.subcategorias_asociadas) {
                setSubCategoriasAsociados(response.subcategorias_asociadas)
            } else {
                setSubCategoriasAsociados([])
            }
        } catch (e) {
            Swal.fire({
                icon: 'error',
                text: 'Error al obtener las subcategorias asociadas'
            })
        }

    }

    const handleSelectSubCategoria = (subCategoria: ISubCategoriaProductoCrm) => {
        const nuevaSubcateroriaAsociar: ISubCategoriaASociada = {
            cod_subcategoria: subCategoria.id,
            nombre: subCategoria.sub_categoria,
            valor: 0
        }
        setNuevaSubCategoriaAsociar(nuevaSubcateroriaAsociar)
        setOpen(true);
    }


    return (
        <>
            <div className='pe-5'>
                <p className='my-6'> Cargos por entidad </p>
                <ButtonGroup variant="outlined" aria-label="Cargos">
                    {

                        cargos.map((cargo) => (
                            <Button
                                key={cargo.cod_cargo_entidad}
                                onClick={() => handleObtenerDetalleCargo(cargo.cod_cargo_entidad)}
                            > {cargo.nombre} - LOTE {cargo.lote}</Button>
                        ))
                    }
                </ButtonGroup>

                <br />
                <br />
                <Divider />
                <br />
                {
                    cargosProductos.length > 0 &&
                    <ButtonGroup variant="outlined" aria-label="Cargos">
                        {
                            cargosProductos.map((cargoProducto) => (
                                <Button
                                    key={cargoProducto.cod_cargo_bonos_producto}
                                    onClick={() => handleAsociarProductosBonoProducto(cargoProducto)}
                                > {cargoProducto.nombre}</Button>
                            ))
                        }
                    </ButtonGroup>
                }

                {
                    selectedCargosProductos &&

                    <Box>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={7}>
                                <TablaCategoriasProductos 
                                    selectSubCategoria={handleSelectSubCategoria}
                                    subCategoriasAsociados = {subCategoriasAsociados} 
                                />
                            </Grid>
                            <Grid item xs={12} md={5}>
                                <div className='rounded-xl border border-gray-200 bg-white shadow-md p-4 ms-4'>
                                    <p className='my-3 text-3xl font-bold text-gray-700'>Total: {currencyFormat(selectedCargosProductos?.valor || 0)}</p>

                                    {open && (
                                        <>

                                            <p className='my-3 text-lg font-bold text-gray-500'>Asociar nueva sub-categoria:</p>
                                            <CardSubCategoria
                                                codCargoBonoProducto={selectedCargosProductos.cod_cargo_bonos_producto}
                                                crear
                                                inputRef={inputRef}
                                                subcategoria={nuevaSubCategoriaAsociar}
                                                cerrarNuevaAsociacion={() => setOpen(false)}
                                                maxValue = {selectedCargosProductos?.valor || 0}
                                                actualizarAsociaciones ={(actualizar:boolean)=>{
                                                    if(actualizar){
                                                        handleAsociarProductosBonoProducto(selectedCargosProductos)
                                                    }
                                                }}
                                            />
                                        </>
                                    )}
                                    <Divider />
                                    {subCategoriasAsociados.length > 0 ?
                                        <>
                                        <p className='my-6 text-2xl font-bold text-gray-900'>Productos asociados:</p>                                    {
                                        subCategoriasAsociados.map((subCategoria) => (
                                            <CardSubCategoria 
                                                codCargoBonoProducto={selectedCargosProductos.cod_cargo_bonos_producto} 
                                                subcategoria={subCategoria} 
                                                cerrarNuevaAsociacion={() => setOpen(false)}
                                                maxValue = {selectedCargosProductos?.valor || 0}
                                                actualizarAsociaciones ={(actualizar:boolean)=>{
                                                    if(actualizar){
                                                        handleAsociarProductosBonoProducto(selectedCargosProductos)
                                                    }
                                                }}
                                            />
                                        ))
                                        }
                                        </>: <p className='my-6 text-2xl font-bold text-gray-900'>No hay productos asociados a este cargo</p>
                                    }



                                </div>

                            </Grid>
                        </Grid>
                    </Box>
                }
            </div>
            <LoadingSpinnerScreen open={openLoadingSpinner} />
        </>
    )
}
