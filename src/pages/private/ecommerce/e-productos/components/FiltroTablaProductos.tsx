import { useEffect, useMemo, useState } from "react";
import {
    Card,
    CardContent,
    Grid,
    IconButton,
    InputAdornment,
    MenuItem,
    TextField,
    Tooltip
} from "@mui/material";
import { debounce } from "@mui/material/utils";
import { IoDownload , IoSearchCircleOutline, IoTrashBin } from "react-icons/io5";
import { ICategoriaProductoCrm, ISubCategoriaProductoCrm } from "../../../../../interfaces/entidad.interface";
import { IFiltroProductosCRM } from "../../../../../interfaces/ecommerce.interface";
import { obtenerCategoriasProductosCrm, obtenerSubCategoriasProductosCrm } from "../../../../../actions/entidad/entidad";
import Swal from "sweetalert2";
import { descargarExcelImpresionProductosCrm } from "../../../../../actions/ecommerce/ecommerce";


interface Props {
    // categorias: ICategoriaProductoCrm[];
    // subCategorias: ISubCategoriaProductoCrm[];
    onChange: (filtros: IFiltroProductosCRM) => void;
}

export const FiltroTablaProductos = ({ onChange }: Props) => {

    const [buscar, setBuscar] = useState("");
    const [idCategoria, setCategoria] = useState<number>();
    const [idSubCategoria, setSubCategoria] = useState<number>();
    const [categoriasCrm, setCategoriasCrm] = useState<ICategoriaProductoCrm[]>([])
    const [subCategoriasCrm, setSubCategoriasCrm] = useState<ISubCategoriaProductoCrm[]>([])
    const [openLoadingSpinner, setLoadingSpinner] = useState<boolean>(false)

    useEffect(() => {
        getProductosCategorias()
    }, [])

    useEffect(() => {
        emitir(buscar, idCategoria, idSubCategoria);

        return () => {
            emitir.clear();
        };
    }, [buscar, idCategoria, idSubCategoria]);

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

    const onCategoriaChange = async (event: any) => {
        const idCategoria = event.target.value
        setCategoria(idCategoria);

        // Siempre reiniciar la subcategoría
        setSubCategoria(undefined);

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

    const handleReiniciarFiltro = () => {
        setSubCategoriasCrm([]);
        setBuscar('')
        setSubCategoria(undefined)
        setCategoria(undefined);
    }

    const handleDescargarExcelImpresion = async ()=>{
        const filtro = {
            buscar,
            idCategoria,
            idSubCategoria
        }
        await descargarExcelImpresionProductosCrm(filtro)
    }

    const emitir = useMemo(
        () =>
            debounce((buscar: string, idCategoria?: number, idSubCategoria?: number) => {
                onChange({
                    buscar,
                    idCategoria,
                    idSubCategoria
                });
            }, 400),
        [onChange]
    );






    return (
        <Card className="mb-4 rounded-xl shadow-sm p-5">
            <CardContent>
                <Grid container spacing={3}>

                    <Grid className="mx-3" xs={12} md={6}>
                        <TextField

                            fullWidth
                            placeholder="Buscar por descripción, lote o código..."
                            value={buscar}
                            onChange={(e) => setBuscar(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton edge="end">
                                            <IoSearchCircleOutline />
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Grid>

                    <Grid className="mx-3" xs={12} md={2}>
                        <TextField
                            fullWidth
                            select
                            label="Categoría"
                            value={idCategoria ?? ""}
                            onChange={onCategoriaChange}
                        >
                            <MenuItem value="">
                                Todas
                            </MenuItem>

                            {categoriasCrm.map(c => (
                                <MenuItem
                                    key={c.id}
                                    value={c.id}
                                >
                                    {c.categoria}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    <Grid className="mx-3" xs={12} md={2}>
                        <TextField
                            fullWidth
                            select
                            label="Subcategoría"
                            value={idSubCategoria ?? ""}
                            onChange={(e) =>
                                setSubCategoria(
                                    e.target.value === ""
                                        ? undefined
                                        : Number(e.target.value)
                                )
                            }
                        >
                            <MenuItem value="">
                                Todas
                            </MenuItem>

                            {subCategoriasCrm.map(sc => (
                                <MenuItem
                                    key={sc.id}
                                    value={sc.id}
                                >
                                    {sc.sub_categoria}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    <Grid className="mx-3 flex items-center justify-center">
                        <Tooltip title="Reiniciar Filtro">
                            <IconButton
                                color="error"
                                onClick={handleReiniciarFiltro}
                            >
                                <IoTrashBin />
                            </IconButton>
                        </Tooltip>
                    </Grid>

                     <Grid className="mx-3 flex items-center justify-center">
                        <Tooltip title="Descargar productos para impresión">
                            <IconButton
                                color="primary"
                                onClick={handleDescargarExcelImpresion}
                            >
                                <IoDownload  />
                            </IconButton>
                        </Tooltip>
                    </Grid>

                </Grid>
            </CardContent>
        </Card>
    );

};