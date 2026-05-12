import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import Swal from 'sweetalert2';
import { obtenerCategoriasProductosCrm, obtenerSubCategoriasProductosCrm } from '../../../../../actions/entidad/entidad';
import { ICategoriaProductoCrm, ISubCategoriaASociada, ISubCategoriaProductoCrm } from '../../../../../interfaces/entidad.interface';
import LoadingSpinnerScreen from '../../../../../components/loadingSpinnerScreen/LoadingSpinnerScreen';
import { Button, Card } from '@mui/material';

const customStyles = {
    rows: {
        style: {
            minHeight: '60px',
            borderBottom: '1px solid #e5e7eb', // gray-200
        },
    },
    headCells: {
        style: {
            backgroundColor: '#f9fafb', // gray-50
            fontWeight: 'bold',
            fontSize: '14px',
        },
    },
    cells: {
        style: {
            paddingLeft: '16px',
            paddingRight: '16px',
        },
    },
};

interface Props {
    selectSubCategoria: (idSubCategoria: ISubCategoriaProductoCrm) => void;
    subCategoriasAsociados: ISubCategoriaASociada[]
}

export const TablaCategoriasProductos = ({ selectSubCategoria, subCategoriasAsociados }: Props) => {

    const [categoriasCrm, setCategoriasCrm] = useState<ICategoriaProductoCrm[]>([])
    const [subCategoriasCrm, setSubCategoriasCrm] = useState<ISubCategoriaProductoCrm[]>([])
    const [openLoadingSpinner, setLoadingSpinner] = useState<boolean>(false)
    const [subCategoriasExcluidas, setSubCategoriasExcluidas] = useState<number[]>([])
    const [expandedRow, setExpandedRow] = useState<number | null>(null);

    useEffect(() => {
        getProductosCategorias()
    }, [])

    useEffect(() => {
        setSubCategoriasExcluidas(subCategoriasAsociados.map((subCategoria) => subCategoria.cod_subcategoria))
    }, [subCategoriasAsociados])


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

    // A super simple expandable component.
    const ExpandedComponent = () => {

        return (
            <>
                <Card className='mx-3 my-3'>
                    <DataTable
                        columns={columnSubCategoria}
                        data={subCategoriasCrm}
                        customStyles={customStyles}
                    />
                </Card>
            </>
        )
    };

    const columns = [
        {
            name: 'id',
            selector: (row: ICategoriaProductoCrm) => row.id,
        },
        {
            name: 'Categoria',
            selector: (row: ICategoriaProductoCrm) => row.categoria,
        },
    ];

    const columnSubCategoria = [
        {
            name: 'id',
            selector: (row: ISubCategoriaProductoCrm) => row.id,
        },
        {
            name: 'sub_categoria',
            selector: (row: ISubCategoriaProductoCrm) => row.sub_categoria,
        },
        {
            name: 'Acciones',
            cell: (row: ISubCategoriaProductoCrm) =>
            (
                subCategoriasExcluidas.includes(row.id) ? (
                    <Button
                        disabled>
                        Producto Asociado
                    </Button>
                ) : <Button
                    onClick={() => asociarProductoSubCategoria(row || 0)}>
                    Asociar Producto
                </Button>
            )

        },
    ];


    const asociarProductoSubCategoria = async (subCategoria: ISubCategoriaProductoCrm) => {
        try {
            selectSubCategoria(subCategoria)
        } catch (e) {
            Swal.fire({
                icon: 'error',
                text: 'Error al consultar las categorias'
            })
        }
    }

    const expandirSubCategorias = async (categoria: any) => {
        try {
            setLoadingSpinner(true)
            let response = await obtenerSubCategoriasProductosCrm(categoria.id)
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

    return (
        <>
            {/* <DataTable
                columns={columns}
                data={categoriasCrm}
                expandableRows
                expandableRowsComponent={ExpandedComponent}
                onRowExpandToggled={(expanded, row) => {
                    if (expanded) {
                        expandirSubCategorias(row);
                    }
                }}
            /> */}

            <DataTable
                columns={columns}
                data={categoriasCrm}
                expandableRows
                expandableRowsComponent={ExpandedComponent}

                expandableRowExpanded={(row) =>
                    row.id === expandedRow
                }

                onRowExpandToggled={(expanded, row) => {

                    if (expanded) {

                        setExpandedRow(row.id);

                        expandirSubCategorias(row);

                    } else {

                        setExpandedRow(null);
                    }
                }}
            />
            <LoadingSpinnerScreen open={openLoadingSpinner} />
        </>


    )
}
