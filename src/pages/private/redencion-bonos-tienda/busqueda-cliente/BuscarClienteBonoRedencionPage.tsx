import React, { useEffect, useState } from 'react'
import { useFilteredData } from '../../../../hooks/useFilteredData';
import { IUsuarioBonoBusquedaAgrupada } from '../../../../interfaces/entidad_bonos.interface';
import { Title } from '../../../../components/title/Title';
import LoadingSpinnerScreen from '../../../../components/loadingSpinnerScreen/LoadingSpinnerScreen';
import DataTable from 'react-data-table-component';
import Swal from 'sweetalert2';
import clsx from 'clsx';
import { Button, Card, TextField } from '@mui/material';
import { buscarBonosCedula, consultarBonosFiltro } from '../../../../actions/entidad_bono/entidad_bono';
import { useNavigate } from 'react-router-dom';


export const BuscarClienteBonoRedencionPage = () => {

  const [usuarios, setUsuarios] = useState<IUsuarioBonoBusquedaAgrupada[]>([]);
  const [openLoadingSpinner, setOpenLoadingSpinner] = useState(false)
  const { search, setSearch, filteredData } = useFilteredData(usuarios);
  const [documento, setDocumento] = useState('')
  const [openDialogRedencion, setOpenDialogRedencion] = useState(false)
  const [codUsuarioRedimir, setCodUsuarioRedimir] = useState<number>(0)
  const navigate = useNavigate();

  const columns = [
    {
      name: 'Cantiad bonos',
      selector: (row: IUsuarioBonoBusquedaAgrupada) => row.cantidad_codigos,
      sortable: true
    },
    {
      name: 'Nombre',
      selector: (row: IUsuarioBonoBusquedaAgrupada) => row.nombre,
      sortable: true,
      wrap: true
    },
    {
      name: 'Cedula',
      selector: (row: IUsuarioBonoBusquedaAgrupada) => row.cedula,
      sortable: true
    },
    {
      name: 'Sexo',
      selector: (row: IUsuarioBonoBusquedaAgrupada) => (row.sexo === "F") ? "Femenino" : "Masculino"
    },
    {
      name: 'Entidad',
      selector: (row: IUsuarioBonoBusquedaAgrupada) => row.entidad,
      wrap: true
    },
    {
      name: 'NIT Entidad',
      selector: (row: IUsuarioBonoBusquedaAgrupada) => row.nit
    },
    {
      name: 'No Contrato',
      selector: (row: IUsuarioBonoBusquedaAgrupada) => row.no_contrato,
      wrap: true
    },
    {
      name: 'Estado',
      cell: (row: IUsuarioBonoBusquedaAgrupada) => {

        if (row.redimido) {
          return (
            <Button size='small' color='success'>Bono redimido</Button>
          )
        } else {
          return (
            <Button size='small' color='primary'>Pendiente por redimir</Button>
          )
        }
      },
    }, {
      name: 'Acciones',
      cell: (row: IUsuarioBonoBusquedaAgrupada) => (
        <button
          onClick={() => handleClicGestionarBono(row.cod_usuarios, row.redimido)}
          disabled={row.redimido}
          className={
            clsx(
              "bg-blue-500 text-white px-2 py-1 rounded",
              {
                'bg-green-500': row.redimido
              }
            )
          }
        >
          {row.redimido ? 'Bonos redimidos' : 'Redimir Bono'}
        </button>
      )
    },

  ];


  const handleClicGestionarBono = (codUsuarios: string, redimido:boolean) => {
    if(!redimido){
      
      navigate('/redencion_bonos_tienda', {
        state: { codUsuarios }
      });
    }
    
  };


  const handleBuscarCliente = async () => {
    setOpenLoadingSpinner(true)
    let response = await buscarBonosCedula(documento.trim())
    setOpenLoadingSpinner(false)
    if (response?.error == 0) {
      setUsuarios(response.usuarios)
    } else if (response?.error == 1) {
      Swal.fire(response.msg)
    }
  }

  return (

    <>
      <div className='m-6'>
        <br />
        <Card className="p-4 mb-4 me-5">
          <div className="flex items-center gap-3 flex-wrap">
            <TextField
              label="Cédula"
              variant="outlined"
              size="small"
              value={documento}
              onChange={(e) => setDocumento(e.target.value)}
              className="w-[250px]"
            />

            <Button
              variant="contained"
              color="success"
              size="small"
              onClick={handleBuscarCliente}
              className="h-10"
            >
              Buscar Cliente
            </Button>
          </div>
        </Card>

        <div className="container mx-auto p-4">

          {
            (usuarios.length > 0) &&
            <>
              <Title title="usuarios" />
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="border rounded p-2"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

              </div>

              <DataTable
                columns={columns}
                data={filteredData}
                pagination
                highlightOnHover
                noDataComponent='No Hay datos para mostrar'
              />

            </>
          }
          <LoadingSpinnerScreen open={openLoadingSpinner} />

        </div>
      </div>

      {/* <DialogRedencionBonos 
                  openDialog={openDialogRedencion} 
                  codUsuario={codUsuarioRedimir} 
                  onClose={handleCloseDialogRedencion}
              />  */}
    </>
  )
}
