import React, { useEffect, useState } from 'react'
import LoadingSpinnerScreen from '../../../../components/loadingSpinnerScreen/LoadingSpinnerScreen'
import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { ICategoriaActiva } from '../../../../interfaces/categoria.interface';
import { obtenerCategoriasActivas } from '../../../../actions/categorias/categorias';
import { crearCargoEntidad, detalleCargoEntidad, editarCargoEntidad } from '../../../../actions/entidad/entidad';
import { BotonProductoCategoria } from './BotonProductoCategoria';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

interface Props {
    openDialog: boolean;
    onClose: (actualizarUsuario: boolean) => void;
    codCargoEntidad: number;
    codEntidad:number;
}

interface ICargoCategoria {
    nombre: string,
    lote:number,
    cod_categorias: string[],
}

const defaulValueCargo: ICargoCategoria = {
    nombre: '',
    lote:0,
    cod_categorias:[],
}

export const FormCargoEntidad = ({ codCargoEntidad, codEntidad, openDialog, onClose }: Props) => {

    const [openLoadingSpinner, setLoadingSpinner] = useState<boolean>(false)
    const [categoriasSave, setCategoriasSave] = useState<{ cod_categoria: number, cantidad: number }[]>([]);
    const [categorias, setCategorias] = useState<ICategoriaActiva[]>([]);
    const navigate = useNavigate()

    const { handleSubmit, reset, control, formState: { isValid }, watch } = useForm<ICargoCategoria>({
        defaultValues: defaulValueCargo
    });

    useEffect(() => {
        obtenerTodasCategorias()
        if (codCargoEntidad && +codCargoEntidad !== 0) {
            obtenerInfoCargoEntidad(codCargoEntidad)
        } else {
            reset(defaulValueCargo)
        }
    }, [codCargoEntidad])

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
                    nombre:response.cargo.nombre,
                    cod_categorias: response.cargo.cod_categorias.map((cat: any) => cat.cod_categoria),
                    lote:response.cargo.lote
                }
                setCategoriasSave(response.cargo.cod_categorias)
                reset(cargoAux)
            }    
        } catch (e) {

        }

    }


    const onSubmit: SubmitHandler<ICargoCategoria> = async (data) => {
        let dataAux: any = data
        dataAux.cod_categorias = categoriasSave
        dataAux.cod_entidad = codEntidad
        if (!codCargoEntidad || +codCargoEntidad === 0) {

            setLoadingSpinner(true)
            let response = await crearCargoEntidad(dataAux);
            setLoadingSpinner(false)
            if (response) {
                if (response.error === 0) {
                    // navigate('/entidades/admin-entidad/' + response.cod_entidad.toString())
                    onClose(true)
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

    // Obtener el valor actual de cod_categorias
    const codCategorias = watch('cod_categorias');

    const nombreCategoria = (codCategoria: number) => {
        return categorias.filter((categoria) => categoria.cod_categoria === codCategoria)[0].nombre
    }

    const cantidadCategoria = (codCategoria: number) => {
        return categoriasSave.filter((categoria) => categoria.cod_categoria === codCategoria)[0].cantidad
    }

    const handleCantidadCategoria = (cod_categoria: number, cantidad: number) => {
        let categoriaFilter = categoriasSave.findIndex((categoria) => categoria.cod_categoria === cod_categoria);

        if (categoriaFilter === -1) {
            setCategoriasSave([...categoriasSave, { cod_categoria, cantidad }]);
        } else {

            const nuevasCategorias = [...categoriasSave];
            nuevasCategorias[categoriaFilter] = { cod_categoria, cantidad };
            setCategoriasSave(nuevasCategorias);
        }

    }

    const sincronizarCategorias = () => {

        // Filtrar categorías existentes que no están en codCategorias
        const categoriasFiltradas = categoriasSave.filter((categoria) =>
            watch('cod_categorias').map((cat) => cat.toString()).includes(categoria.cod_categoria.toString())
        );

        watch('cod_categorias').forEach((codCategoria) => {
            const existe = categoriasFiltradas.some(
                (categoria) => categoria.cod_categoria === +codCategoria
            );

            if (!existe) {
                categoriasFiltradas.push({
                    cod_categoria: +codCategoria,
                    cantidad: 0,
                });
            }
        });

        // Actualizar el estado con las categorías sincronizadas
        setCategoriasSave(categoriasFiltradas);
    };

    return (
        <>
            <Dialog
                open={openDialog}
                onClose={() => onClose(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth='lg'
            >
                <DialogTitle id="alert-dialog-title">
                    Crear Cargo Entidad
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
                                        value={field.value || ''}
                                    />
                                )}
                            />
                            <br />


                            <Controller
                                name="cod_categorias"
                                control={control}
                                rules={{ required: 'Categorias es obligatorio' }}
                                render={({ field }) => (
                                    <>
                                        <InputLabel id="Categoria" className='mt-4'>Categorias</InputLabel>
                                        <Select
                                            {...field}
                                            label="Categoria"
                                            labelId="Categoria"
                                            multiple
                                            onChange={(event) => {
                                                field.onChange(event);
                                                sincronizarCategorias()
                                            }}
                                            value={field.value}
                                        >
                                            {categorias.map((categoria) => (
                                                <MenuItem key={categoria.cod_categoria} value={categoria.cod_categoria}>
                                                    <Checkbox checked={field.value.map(value => value.toString()).indexOf(categoria.cod_categoria.toString()) > -1} />
                                                    {categoria.nombre}
                                                </MenuItem>
                                            ))
                                            }
                                        </Select>
                                    </>
                                )}
                            />

                           


                            {/* Mapear los valores seleccionados */}
                            <div className="my-7 flex row justify-start">
                                {codCategorias.map((cod) => (

                                    <BotonProductoCategoria
                                        key={cod}
                                        codCategoria={+cod}
                                        cantidadDefecto={cantidadCategoria(+cod)}
                                        categoria={nombreCategoria(+cod)}
                                        handleCantidadCategoria={handleCantidadCategoria}
                                    />
                                ))}

                            </div>

                        </div>

                    </DialogContent>

                    <DialogActions>
                        <Button onClick={() => onClose(false)}>Cancelar</Button>
                        <Button type='submit' disabled={!isValid}>
                             {(!codCargoEntidad || +codCargoEntidad === 0) ? 'Crear Cargo' : 'Editar Cargo'}
                        </Button>
                    </DialogActions>
                </form>

            </Dialog>


            <LoadingSpinnerScreen open={openLoadingSpinner} />
        </>
    )
}
