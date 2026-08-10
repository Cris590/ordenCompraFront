import React, { useEffect, useState } from 'react'
import { obtenerCategoriasProductosCrm, obtenerSubCategoriasProductosCrm } from '../../../../actions/entidad/entidad'
import Swal from 'sweetalert2'
import { ICategoriaProductoCrm, ISubCategoriaProductoCrm } from '../../../../interfaces/entidad.interface'
import { Button, Card, IconButton, Tooltip } from '@mui/material'
import LoadingSpinnerScreen from '../../../../components/loadingSpinnerScreen/LoadingSpinnerScreen'
import DataTable from 'react-data-table-component'
import { IoAddCircleSharp, IoLogoWordpress, IoPencilSharp } from 'react-icons/io5'
import { crearCategoriaCRM, sincronizarCategoriaEcommerce, sincronizarSubCategoriaEcommerce } from '../../../../actions/ecommerce/ecommerce'
import { DialogCategoria } from './components/DialogCategoria'
import { ICategoriaCrm, ISubCategoriaCrm } from '../../../../interfaces/ecommerce.interface'
import { DialogSubCategoria } from './components/DialogSubCategoria'

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

export const EcaterogiasPage = () => {

  const [categoriasCrm, setCategoriasCrm] = useState<ICategoriaProductoCrm[]>([])
  const [subCategoriasCrm, setSubCategoriasCrm] = useState<ISubCategoriaProductoCrm[]>([])
  const [openLoadingSpinner, setLoadingSpinner] = useState<boolean>(false)
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const [openModalCategoria, setOpenModalCategoria] = useState<boolean>(false)
  const [openModalSubCategoria, setOpenModalSubCategoria] = useState<boolean>(false)
  const [subCategoriaSelected, setSubCategoriaSelected] = useState<ISubCategoriaCrm>({ sub_categoria: '', id_categoria: 0 })
  const [categoriaSelected, setCategoriaSelected] = useState<ICategoriaCrm>({ categoria: '' })


  useEffect(() => {
    getProductosCategorias()
  }, [])

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

  const sincronizarCategoria = async (codCategoria: number) => {
    const result = await Swal.fire({
      title: '¿Sincronizar categoría?',
      text: 'Se sincronizará esta categoría con el E-commerce.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, sincronizar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      setLoadingSpinner(true);
      const response = await sincronizarCategoriaEcommerce(codCategoria);

      setLoadingSpinner(false);

      if (response) {
        Swal.fire(response.msg);
        getProductosCategorias()
      }
    } catch (e) {
      setLoadingSpinner(false);

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al sincronizar la categoría, comuníquese con el administrador.',
      });
    }
  };

  const sincronizarSubCategoria = async (codSubCategoria: number) => {
    const result = await Swal.fire({
      title: '¿Sincronizar Sub-Categoría?',
      text: 'Se sincronizará esta Sub-Categoría con el E-commerce.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, sincronizar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    });

    if (!result.isConfirmed) return

    try {
      setLoadingSpinner(true);
      const response = await sincronizarSubCategoriaEcommerce(codSubCategoria);
      setLoadingSpinner(false);
      setExpandedRow(null);
      if (response) {
        Swal.fire(response.msg);
        getProductosCategorias()
      }
    } catch (e) {
      setLoadingSpinner(false);
      
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al sincronizar la categoría, comuníquese con el administrador.',
      });
    }
  };

  const handleCrearCategoria = () => {
    setCategoriaSelected({ id: 0, categoria: '' })
    setOpenModalCategoria(true)
  }

  const handleEditarCategoria = (id: number, categoria: string) => {
    setCategoriaSelected({ id, categoria })
    setOpenModalCategoria(true)
  }

  const handleCloseCategoria = () => {
    getProductosCategorias()
    setCategoriaSelected({ id: 0, categoria: '' })
    setOpenModalCategoria(false)
  }

  const handleCrearSubCategoria = (id_categoria: number) => {
    console.log(id_categoria)
    setSubCategoriaSelected({ id_categoria, sub_categoria: '' })
    setOpenModalSubCategoria(true)
  }

  const handleEditarSubCategoria = (id: number, sub_categoria: string, id_categoria: number) => {
    setSubCategoriaSelected({ id, sub_categoria, id_categoria })
    setOpenModalSubCategoria(true)
  }

  const handleCloseSubCategoria = () => {
    getProductosCategorias()
    setSubCategoriaSelected({ id: 0, sub_categoria: '', id_categoria: 0 })
    setExpandedRow(null);
    setOpenModalSubCategoria(false)
  }

  const columns = [
    {
      name: 'id',
      selector: (row: ICategoriaProductoCrm) => row.id,
    },
    {
      name: 'Categoria',
      selector: (row: ICategoriaProductoCrm) => row.categoria,
    },
    {
      name: 'Acciones',
      cell: (row: ICategoriaProductoCrm) =>
      (<>
        <Tooltip title="Editar Categoría">
          <IconButton
            color="secondary"
            onClick={() => handleEditarCategoria(row.id, row.categoria)}
          >
            <IoPencilSharp />
          </IconButton>
        </Tooltip>

        <Tooltip title="Crear Subcategoría">
          <IconButton
            color="primary"
            onClick={() => handleCrearSubCategoria(row.id)}
          >
            <IoAddCircleSharp />
          </IconButton>
        </Tooltip>

        <Tooltip
          title={
            row.id_woo
              ? "Categoría asociada correctamente"
              : "Asociar categoría a E-commerce"
          }
        >
          <IconButton
            color={row.id_woo ? "success" : "primary"}
            onClick={
              row.id_woo
                ? undefined
                : () => sincronizarCategoria(row.id)
            }
          >
            <IoLogoWordpress />
          </IconButton>
        </Tooltip>
      </>)

    }
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
      (<>
        <Tooltip title="Editar Sub Categoría">
          <IconButton
            color="secondary"
            onClick={() =>
              handleEditarSubCategoria(
                row.id,
                row.sub_categoria,
                row.id_categoria
              )
            }
          >
            <IoPencilSharp />
          </IconButton>
        </Tooltip>

        <Tooltip
          title={
            row.id_woo
              ? "Subcategoría ya asociada al E-commerce"
              : "Asociar subcategoría al E-commerce"
          }
        >
          <IconButton
            color={row.id_woo ? "success" : "primary"}
            onClick={
              row.id_woo
                ? undefined
                : () => sincronizarSubCategoria(row.id)
            }
          >
            <IoLogoWordpress />
          </IconButton>
        </Tooltip>
      </>)

    },
  ];
  return (
    <>
      <div className='pe-5'>
        <p className='my-6 font-bold'>Categorias </p>

        <Button type="button"  onClick={handleCrearCategoria}>Crear Categoria</Button>
        <div className='m-3 p-3'>
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
        </div>
      </div>

      <DialogCategoria
        open={openModalCategoria}
        onClose={handleCloseCategoria}
        categoria={categoriaSelected}
      />
      <DialogSubCategoria
        open={openModalSubCategoria}
        onClose={handleCloseSubCategoria}
        subcategoria={subCategoriaSelected}
      />
      <LoadingSpinnerScreen open={openLoadingSpinner} />
    </>
  )
}
