import React, { useEffect, useRef, useState } from 'react'
import LoadingSpinnerScreen from '../../../../../../components/loadingSpinnerScreen/LoadingSpinnerScreen';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Button, Card, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import Swal from 'sweetalert2';
import { IEditarProductoModeloCrm, IProductoResumenCrm } from '../../../../../../interfaces/ecommerce.interface';
import { ICategoriaProductoCrm, ISubCategoriaProductoCrm } from '../../../../../../interfaces/entidad.interface';
import { obtenerCategoriasProductosCrm, obtenerSubCategoriasProductosCrm } from '../../../../../../actions/entidad/entidad';
import { useProductoEdicionStore } from '../../../../../../store/ecommerce/producto-edicion';


interface Props {
    producto: IEditarProductoModeloCrm,
    onChange: (
        data: IActualizacionFormProductoGeneral,
        valid: boolean
    ) => void;
}

interface IActualizacionFormProductoGeneral {
    id_categoria: number,
    id_sub_categoria: number,
    activo: 1 | 0,
    descripcion: string,
    precio_compra: number,
    precio_venta: number,
    lote: string,
    codigo_modelo?: string
}

const defaultProductoGeneral: IActualizacionFormProductoGeneral = {
    id_categoria: 0,
    id_sub_categoria: 0,
    activo: 1,
    descripcion: '',
    precio_compra: 0,
    precio_venta: 0,
    lote: ''
}

export const StepConfiguracionProductoGeneral = ({ onChange , producto}: Props) => {

    const [openLoadingSpinner, setLoadingSpinner] = useState<boolean>(false)
    const [esEdicionProducto, setEsEdicionProducto] = useState<boolean>(false)
    const [categoriasCrm, setCategoriasCrm] = useState<ICategoriaProductoCrm[]>([])
    const [subCategoriasCrm, setSubCategoriasCrm] = useState<ISubCategoriaProductoCrm[]>([])
    const inicializando = useRef(true);
    /** Store producto */
    // const producto = useProductoEdicionStore((state) => state.producto)
    // const setProductoSeleccionado = useProductoEdicionStore((state) => state.setEdicionProducto)

    const { reset, control, formState: { isValid }, watch } = useForm<IActualizacionFormProductoGeneral>({
        mode: "onChange",
        defaultValues: defaultProductoGeneral
    });

    const getProductosCategorias = async () => {
        try {
            setLoadingSpinner(true)
            let response = await obtenerCategoriasProductosCrm()
            setLoadingSpinner(false)
            if (response?.error == 0) {
                setCategoriasCrm(response.categorias)
            } else if (response?.error == 1) {
                Swal.fire(response.msg)
            }
        } catch (e) {
            Swal.fire({
                icon: 'error',
                text: 'Error al consultar las categorias'
            })
        }
    }
    const onCategoriaChange = async (idCategoria: number) => {

        if (!idCategoria) {
            setSubCategoriasCrm([]);
            return;
        }
        await expandirSubCategorias(idCategoria);
    }

    const expandirSubCategorias = async (id_categoria: number) => {
        try {
            setLoadingSpinner(true)
            let response = await obtenerSubCategoriasProductosCrm(id_categoria)
            setLoadingSpinner(false)
            if (response?.error == 0) {
                setSubCategoriasCrm(response.subcategorias)
            } else if (response?.error == 1) {
                Swal.fire(response.msg)
            }
        } catch (e) {
            Swal.fire({
                icon: 'error',
                text: 'Error al consultar las categorias'
            })
        }
    }

    const values = watch();

    useEffect(() => {

        if (inicializando.current) {
            return;
        }

        onChange(values, isValid);

    }, [values, isValid]);

    useEffect(() => {
        console.log('------- Producto -------')
        console.log(producto)

        const init = async () => {

            await getProductosCategorias();

            if (producto.nuevo_producto && !producto.id_categoria) {
                setEsEdicionProducto(false);
                inicializando.current = false;
                return;
            }

            setEsEdicionProducto(!producto.nuevo_producto);
            setLoadingSpinner(true)
            const response = await obtenerSubCategoriasProductosCrm(producto.id_categoria);
            setLoadingSpinner(false)

            if (response?.error === 0) {
                setSubCategoriasCrm(response.subcategorias);
            }

            reset({
                id_categoria: producto.id_categoria,
                id_sub_categoria: producto.id_sub_categoria,
                activo: 1,
                descripcion: producto.descripcion,
                precio_compra: producto.precio_compra,
                precio_venta: producto.precio_venta,
                lote: producto.lote
            });


            inicializando.current = false;
        }


        init();

    }, []);


    return (
        <>
            <Card className="p-6">

                <Typography variant="h5" fontWeight={600}>
                    Información del producto
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    className="mb-6"
                >
                    Complete la información general del producto.
                </Typography>

                {/* Aquí pegas el formulario */}
                <form className="w-full">

                    <div className="grid grid-cols-12 gap-5">

                        {/* Categoria */}
                        <div className="col-span-12 md:col-span-4">
                            <Controller
                                name="id_categoria"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <InputLabel className="mb-1">Categoría</InputLabel>

                                        <Select
                                            fullWidth
                                            {...field}
                                            onChange={(event) => {
                                                field.onChange(event);
                                                onCategoriaChange(+event.target.value);
                                            }}
                                            disabled={esEdicionProducto}
                                        >
                                            <MenuItem value={0}>
                                                Seleccione Categoria
                                            </MenuItem>
                                            {categoriasCrm.map((categoria) => (
                                                <MenuItem
                                                    key={categoria.id}
                                                    value={categoria.id}
                                                >
                                                    {categoria.categoria}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </>
                                )}
                            />
                        </div>

                        {/* Subcategoria */}
                        <div className="col-span-12 md:col-span-4">
                            <Controller
                                name="id_sub_categoria"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <InputLabel className="mb-1">
                                            Subcategoría
                                        </InputLabel>

                                        <Select
                                            fullWidth
                                            {...field}
                                            disabled={subCategoriasCrm.length === 0 || esEdicionProducto}

                                        >
                                            <MenuItem value={0}>
                                                Seleccione Sub Categoria
                                            </MenuItem>
                                            {subCategoriasCrm.map((subcategoria) => (
                                                <MenuItem
                                                    key={subcategoria.id}
                                                    value={subcategoria.id}
                                                >
                                                    {subcategoria.sub_categoria}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </>
                                )}
                            />
                        </div>

                        {/* Activo */}
                        <div className="col-span-12 md:col-span-4">
                            <Controller
                                name="activo"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <InputLabel className="mb-1">
                                            Estado
                                        </InputLabel>

                                        <Select
                                            fullWidth
                                            {...field}
                                        >
                                            <MenuItem value={1}>
                                                Activo
                                            </MenuItem>

                                            <MenuItem value={0}>
                                                Inactivo
                                            </MenuItem>
                                        </Select>
                                    </>
                                )}
                            />
                        </div>

                        {/* Descripcion */}
                        <div className="col-span-12">
                            <Controller
                                name="descripcion"
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <TextField
                                        fullWidth
                                        label="Descripción"
                                        multiline
                                        rows={3}
                                        {...field}
                                        value={field.value || ""}
                                    />
                                )}
                            />
                        </div>

                        {/* Lote */}
                        <div className="col-span-12 md:col-span-4">
                            <Controller
                                name="lote"
                                control={control}
                                rules={{
                                    required: "El lote es obligatorio",
                                    maxLength: {
                                        value: 4,
                                        message: "Máximo 4 caracteres"
                                    },
                                    minLength: {
                                        value: 4,
                                        message: "Debe tener 4 caracteres"
                                    }
                                }}
                                render={({ field, fieldState }) => (
                                    <TextField
                                        fullWidth
                                        label="Lote"
                                        {...field}
                                        value={field.value || ""}
                                        inputProps={{
                                            maxLength: 4
                                        }}
                                        error={!!fieldState.error}
                                        helperText={fieldState.error?.message}
                                        disabled={esEdicionProducto}
                                    />
                                )}
                            />
                        </div>

                        {/* Precio Compra */}
                        <div className="col-span-12 md:col-span-4">
                            <Controller
                                name="precio_compra"
                                control={control}
                                rules={{
                                    required: "El precio de compra es obligatorio",
                                    min: {
                                        value: 1,
                                        message: "Debe ser mayor que cero"
                                    },
                                    validate: value =>
                                        !isNaN(Number(value)) || "Debe ser un número"
                                }}
                                render={({ field, fieldState }) => (
                                    <TextField
                                        fullWidth
                                        type="number"
                                        label="Precio compra"
                                        {...field}
                                        value={field.value || ""}
                                        error={!!fieldState.error}
                                        helperText={fieldState.error?.message}
                                        inputProps={{
                                            min: 1,
                                            step: 1
                                        }}
                                        onKeyDown={(e) => {
                                            if (["e", "E", "+", "-", "."].includes(e.key)) {
                                                e.preventDefault();
                                            }
                                        }}
                                    />
                                )}
                            />
                        </div>

                        {/* Precio Venta */}
                        <div className="col-span-12 md:col-span-4">
                            <Controller
                                name="precio_venta"
                                control={control}
                                rules={{
                                    required: "El precio de venta es obligatorio",
                                    min: {
                                        value: 1,
                                        message: "Debe ser mayor que cero"
                                    },
                                    validate: value =>
                                        !isNaN(Number(value)) || "Debe ser un número"
                                }}
                                render={({ field, fieldState }) => (
                                    <TextField
                                        fullWidth
                                        type="number"
                                        label="Precio compra"
                                        {...field}
                                        value={field.value || ""}
                                        error={!!fieldState.error}
                                        helperText={fieldState.error?.message}
                                        inputProps={{
                                            min: 1,
                                            step: 1
                                        }}
                                        onKeyDown={(e) => {
                                            if (["e", "E", "+", "-", "."].includes(e.key)) {
                                                e.preventDefault();
                                            }
                                        }}
                                    />
                                )}
                            />
                        </div>
                    </div>

                </form>

            </Card>
            <LoadingSpinnerScreen open={openLoadingSpinner} />

        </>
    )
}
