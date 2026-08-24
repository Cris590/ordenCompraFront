import React, { useEffect, useState } from 'react'
import { DialogClientePos } from './components/DialogClientePos';
import DataTable from 'react-data-table-component';
import { Button, Tooltip } from '@mui/material';
import LoadingSpinnerScreen from '../../../components/loadingSpinnerScreen/LoadingSpinnerScreen';
import { Title } from '../../../components/title/Title';
import { useFilteredData } from '../../../hooks/useFilteredData';
import { obtenerClientesCrm } from '../../../actions/pos/pos';
import { IClienteCrm, IClienteTablaCrm } from '../../../interfaces/pos.interface';
import { formatDate } from '../../../utils/formatDate';
import { IoPencilOutline } from 'react-icons/io5';



const clienteNuevo: IClienteCrm = {
  id: 0,
  nombre: "",
  id_tipo_documento: 0,
  documento: "",
  dv: 0,
  email: "",
  telefono: "",
  direccion: "",
  fecha_nacimiento: "",
  compras: 0,
  ultima_compra: "",
  fecha: "",
  id_tienda: 0,
  origen: "",
  id_usuario: 0,
}


export const ClientesPosPage = () => {
  const [openLoadingSpinner, setOpenLoadingSpinner] = useState(false)
  const [clientes, setClientes] = useState<IClienteTablaCrm[]>([]);
  const { search, setSearch, filteredData } = useFilteredData(clientes);

  const [openEditCliente, setOpenEditCliente] = useState(false);
  const [clienteEditar, setClienteEditar] = useState<IClienteCrm>(clienteNuevo)

  const columns = [
    {
      name: 'Nombre',
      selector: (row: IClienteTablaCrm) => row.nombre,
      sortable: true,
      wrap: true,
      minWidth: '180px',
    },
    {
      name: 'Tipo documento',
      selector: (row: IClienteTablaCrm) => row.tipo_documento,
      sortable: true,
      wrap: true,
      minWidth: '130px',
    },
    {
      name: 'Documento',
      selector: (row: IClienteTablaCrm) => row.documento,
      sortable: true,
      minWidth: '120px',
    },
    {
      name: 'Email',
      selector: (row: IClienteTablaCrm) => row.email,
      sortable: true,
      wrap: true,
      minWidth: '200px',
    },
    {
      name: 'Teléfono',
      selector: (row: IClienteTablaCrm) => row.telefono,
      sortable: true,
      minWidth: '130px',
    },
    {
      name: 'Dirección',
      selector: (row: IClienteTablaCrm) => row.direccion || '-',
      wrap: true,
      minWidth: '200px',
    },
    {
      name: 'Fecha nacimiento',
      selector: (row: IClienteTablaCrm) => row.fecha_nacimiento,
      sortable: true,
      minWidth: '140px',

    },
    {
      name: 'Tienda',
      selector: (row: IClienteTablaCrm) => row.bodega,
      sortable: true,
      wrap: true,
      minWidth: '150px',
    },
    {
      name: 'Total compras',
      selector: (row: IClienteTablaCrm) => row.compras,
      sortable: true,
      minWidth: '140px',

    },
    {
      name: 'Última compra',
      selector: (row: IClienteTablaCrm) => row.ultima_compra,
      sortable: true,
      minWidth: '140px',
      format: (row: IClienteTablaCrm) =>
        row.ultima_compra
          ? new Date(row.ultima_compra).toLocaleDateString('es-CO')
          : '-',
    },
    {
      name: 'Ingreso cliente',
      selector: (row: IClienteTablaCrm) => row.fecha,
      sortable: true,
      minWidth: '140px',
      format: (row: IClienteTablaCrm) =>
        row.fecha
          ? new Date(row.fecha).toLocaleDateString('es-CO')
          : '-',
    },
    {
      name: 'Acciones',
      cell: (row: IClienteTablaCrm) => (
        <Tooltip title="Editar Cliente" arrow>
          <Button
            onClick={() => handleEditarCliente(row)}
            size="small"
            sx={{
              minWidth: 'auto',
              padding: '6px',
            }}
          >
            <IoPencilOutline size={20} />
          </Button>
        </Tooltip>
      ),
      minWidth: '90px',
    },
  ];

  useEffect(() => {
    obtenerClientes()
  }, [])

  const obtenerClientes = async () => {
    setOpenLoadingSpinner(true)
    let response = await obtenerClientesCrm()
    setOpenLoadingSpinner(false)
    if (response?.error == 0) {
      setClientes(response.clientes)
    }
  }

  const handleEditarCliente = async (cliente: IClienteTablaCrm) => {
    setClienteEditar(cliente)
    setOpenEditCliente(true)
  }

  const handleCloseEditCliente = (actualizarCliente: boolean) => {
    if(actualizarCliente){
        obtenerClientes()
    }
    setOpenEditCliente(false);
  };

  const handleCrearUsuario = () => {
    setClienteEditar(clienteNuevo)
    setOpenEditCliente(true)
  }
  return (
    <>
      <div className="container mx-auto p-4">
        <Title title="Clientes Pos" />
        <div className="mb-4">
          <input
            type="text"
            placeholder="Buscar..."
            className="border rounded p-2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Button className='ml-4' variant="outlined" onClick={handleCrearUsuario}>
            Crear Cliente
          </Button>

        </div>
        <DataTable
          columns={columns}
          data={filteredData}
          pagination
          highlightOnHover
        />
        <LoadingSpinnerScreen open={openLoadingSpinner} />

      </div>

      <DialogClientePos
        openDialog={openEditCliente}
        onClose={handleCloseEditCliente}
        cliente={clienteEditar}
      />
    </>
  )
}
