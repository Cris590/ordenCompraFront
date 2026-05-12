import React, { useEffect, useState } from 'react'
import LoadingSpinnerScreen from '../../../../../components/loadingSpinnerScreen/LoadingSpinnerScreen'
import { Button, ButtonGroup, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { ICategoriaActiva } from '../../../../../interfaces/categoria.interface';
import { obtenerCategoriasActivas } from '../../../../../actions/categorias/categorias';
import { crearCargoEntidad, detalleCargoEntidad, editarCargoEntidad } from '../../../../../actions/entidad/entidad';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { DialogCrearCargosBonosProducto } from './DialogCrearCargosBonosProducto';
import { ICargoBonoProducto } from '../../../../../interfaces/entidad.interface';

interface Props {
    openDialog: boolean;
    onClose: (actualizarUsuario: boolean) => void;
    codCargoEntidad: number;
    codEntidad: number;
}

interface ICargoCategoria {
    nombre: string,
    lote: number,
    cod_cargo_bonos_productos?: string[],
}

const defaulValueCargo: ICargoCategoria = {
    nombre: '',
    lote: 0,
    cod_cargo_bonos_productos: [],
}


export const FormCargoEntidadBono = ({ codCargoEntidad: codCargoEntidadAux, codEntidad, openDialog, onClose }: Props) => {

    const [openLoadingSpinner, setLoadingSpinner] = useState<boolean>(false)
    const [cargosBonos, setCargosBonos] = useState<ICargoBonoProducto[]>([]);
    const [categorias, setCategorias] = useState<ICategoriaActiva[]>([]);
    const [codCargoEntidad, setCodCargoEntidad] = useState(0)
    const [codCargoBonoProducto, setCodCargoBonoProducto] = useState(0)
    const navigate = useNavigate()
    const [openDialogCrearLote, setOpenDialogCrearLote] = useState<boolean>(false)

    const { handleSubmit, reset, control, formState: { isValid }, watch } = useForm<ICargoCategoria>({
        defaultValues: defaulValueCargo
    });

    useEffect(() => {
        obtenerTodasCategorias()
        if (codCargoEntidadAux && +codCargoEntidadAux !== 0) {
            obtenerInfoCargoEntidad(codCargoEntidadAux)
        } else {
            setCargosBonos([])
            reset(defaulValueCargo)
        }
        setCodCargoEntidad(codCargoEntidadAux)
    }, [codCargoEntidadAux])

    const obtenerTodasCategorias = async () => {
        let response = await obtenerCategoriasActivas()
        if (response?.error === 0) {
            setCategorias(response.categorias)
            sincronizarCategorias()
        }
    }

    const obtenerInfoCargoEntidad = async (codCargoEntidad: number) => {
        try {
            let response = await detalleCargoEntidad(codCargoEntidad)
            if (response?.error === 0) {
                if (Object.keys(response.cargo).length === 0) {
                    navigate('/entidades/admin-entidad/')
                }

                let cargoAux: ICargoCategoria = {
                    nombre: response.cargo.nombre,
                    // cod_cargo_bonos_productos: response.cargo.cod_categorias.map((cat: any) => cat.cod_categoria),
                    lote: response.cargo.lote
                }
                setCargosBonos(response.cargo.cod_cargo_bonos_producto || [])
                reset(cargoAux)
            }
        } catch (e) {

        }

    }


    const onSubmit: SubmitHandler<ICargoCategoria> = async (data) => {

        let dataAux: any = data
        dataAux.cod_categorias = []
        dataAux.cod_entidad = codEntidad
        if (!codCargoEntidad || +codCargoEntidad === 0) {

            setLoadingSpinner(true)
            delete dataAux.cod_cargo_bonos_productos
            let response = await crearCargoEntidad(dataAux);
            setLoadingSpinner(false)
            if (response) {
                if (response.error === 0) {
                    // navigate('/entidades/admin-entidad/' + response.cod_entidad.toString())
                    // onClose(true)
                    setCodCargoEntidad(response.cod_cargo_entidad)
                } else {
                    Swal.fire(response.msg)
                }
            }

        } else {

            setLoadingSpinner(true)
            let response = await editarCargoEntidad(dataAux, +codCargoEntidad);
            setLoadingSpinner(false)
            if (response) {
                if (response) {
                    Swal.fire(response.msg)
                    onClose(true)
                }
            }
        }
    }

    const sincronizarCategorias = () => {

        // Filtrar categorías existentes que no están en codCategorias
        // const categoriasFiltradas = categoriasSave.filter((categoria) =>
        //     watch('cod_cargo_bonos_productos').map((cat) => cat.toString()).includes(categoria.cod_categoria.toString())
        // );

        // watch('cod_cargo_bonos_productos').forEach((codCategoria) => {
        //     const existe = categoriasFiltradas.some(
        //         (categoria) => categoria.cod_categoria === +codCategoria
        //     );

        //     if (!existe) {
        //         categoriasFiltradas.push({
        //             cod_categoria: +codCategoria,
        //             cantidad: 0,
        //         });
        //     }
        // });

        // // Actualizar el estado con las categorías sincronizadas
        // setCategoriasSave(categoriasFiltradas);
    };


    const crearLoteProductosCargoEntidad = () => {
        setCodCargoBonoProducto(0)
        setOpenDialogCrearLote(true)
    }

    const onclose = (actualizar?: boolean) => {
        if (actualizar) {
            obtenerInfoCargoEntidad(codCargoEntidad)
        }
        setOpenDialogCrearLote(false)
    }

    const handleEditarLoteCargo = (codCargoBonoProducto: number) => {

        console.log('Si buenas ', codCargoBonoProducto)
        setCodCargoBonoProducto(codCargoBonoProducto)
        setOpenDialogCrearLote(true)
    }

    const handleDialogClose = (event: object, reason: string) => {
        if (reason === 'backdropClick') {
            if(cargosBonos.length == 0){
                alert('No puede cerrar el dialog si el cargo no tiene lotes creados.');
                return;
            }
        }
        onClose(false); // From props
    };

    return (
        <>
            <Dialog
                open={openDialog}
                onClose={handleDialogClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth='lg'
            >
                <DialogTitle id="alert-dialog-title">
                    {codCargoEntidad ? 'Editar ' : 'Crear '}Cargo Entidad Bono
                </DialogTitle>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogContent>

                        <div className="flex flex-col mt-4">
                            <Controller
                                name="nombre"
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <TextField
                                        label="Nombre"
                                        variant="outlined"
                                        {...field}
                                        value={field.value || ''}
                                    />
                                )}
                            />
                            <br />

                            <Controller
                                name="lote"
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <TextField
                                        label="lote"
                                        variant="outlined"
                                        {...field}
                                        value={String(field.value) || ''}
                                    />
                                )}
                            />
                            <br />

                            {(!!codCargoEntidad) &&
                                <Button onClick={crearLoteProductosCargoEntidad}>
                                    Crear lote productos
                                </Button>
                            }



                        </div>

                        <ButtonGroup variant="outlined" aria-label="Cargos" className='mt-3'>
                            {

                                cargosBonos.map((cargo) => (
                                    <Button
                                        key={cargo.cod_cargo_bonos_producto}
                                        onClick={() => handleEditarLoteCargo(cargo.cod_cargo_bonos_producto)}
                                    > {cargo.nombre}</Button>
                                ))
                            }
                        </ButtonGroup>
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={() => onClose(false)}>Cancelar</Button>
                        <Button type='submit' disabled={!isValid}>
                            {(!codCargoEntidad || +codCargoEntidad === 0) ? 'Crear Cargo' : 'Editar Cargo'}
                        </Button>
                    </DialogActions>
                </form>



            </Dialog>

            <DialogCrearCargosBonosProducto
                openDialog={openDialogCrearLote}
                onClose={onclose}
                codCargoBonoProducto={codCargoBonoProducto}
                codCargoEntidad={codCargoEntidad}
            />
            <LoadingSpinnerScreen open={openLoadingSpinner} />
        </>
    )
}
