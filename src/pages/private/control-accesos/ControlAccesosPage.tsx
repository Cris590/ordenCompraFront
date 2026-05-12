import React, { useEffect, useState } from 'react'
import { useFilteredData } from '../../../hooks/useFilteredData';
import DataTable from 'react-data-table-component';
import LoadingSpinnerScreen from '../../../components/loadingSpinnerScreen/LoadingSpinnerScreen';
import { Title } from '../../../components/title/Title';
import { Button, Tooltip } from '@mui/material';
import { obtenerUsuariosAplicativo } from '../../../actions/control-accesos/control-accesos';
import { IEntidadTarjetaBono, IUsuarioAplicacionResumen } from '../../../interfaces/control_accesos.interface';
import { DialogEditarUsuario } from './components/DialogEditarUsuario';


const defaultUsuario: IUsuarioAplicacionResumen = {
    cod_usuario: 0,
    email: '',
    nombre: '',
    usuario: '',
    perfil: '',
    cod_perfil: 0,
    entidades:[]
}


export const ControlAccesosPage = () => {
  const [openLoadingSpinner, setOpenLoadingSpinner] = useState(false)
  const [usuarios, setUsuarios] = useState<IUsuarioAplicacionResumen[]>([]);
  const [entidades, setEntidades] = useState<IEntidadTarjetaBono[]>([]);
  const { search, setSearch, filteredData } = useFilteredData(usuarios);

  const [openEditUsuario, setOpenEditUsuario] = useState(false);
  const [usuarioEditar, setUsuarioEditar] = useState<IUsuarioAplicacionResumen>(defaultUsuario)

  const columns = [
    {
      name: 'Cédula',
      selector: (row: IUsuarioAplicacionResumen) => row.usuario,
    },
    {
      name: 'Nombre',
      selector: (row: IUsuarioAplicacionResumen) => row.nombre,
    },
    {
      name: 'Email',
      selector: (row: IUsuarioAplicacionResumen) => row.email,
    },
    {
      name: 'Perfil',
      selector: (row: IUsuarioAplicacionResumen) => row.perfil,
    },
    {
      name: 'Acciones',
      cell: (row: IUsuarioAplicacionResumen) => (
        <Tooltip title='Editar Usuario'>
          <Button

            onClick={() => handleEditarUsuario(row)}
            variant='outlined'
            size="small"
          >
            Editar
          </Button>
        </Tooltip>
      ),
    },
  ];

  useEffect(() => {
    obtenerUsuarios()
  }, [])

  const obtenerUsuarios = async () => {
    setOpenLoadingSpinner(true)
    let response = await obtenerUsuariosAplicativo()
    setOpenLoadingSpinner(false)
    if (response?.error == 0) {
      setUsuarios(response.usuarios)
      setEntidades(response.entidades)
    }
  }

  const handleEditarUsuario = async (user: IUsuarioAplicacionResumen) => {
    setUsuarioEditar(user)
    setOpenEditUsuario(true)
  }

  const handleCloseEditUsuario = (actualizarUsuarios: boolean) => {
        if(actualizarUsuarios){
            obtenerUsuarios()
        }
        setOpenEditUsuario(false);
    };
  return (
    <>
      <div className="container mx-auto p-4">
        <Title title="Usuarios" />
        <div className="mb-4">
          <input
            type="text"
            placeholder="Buscar..."
            className="border rounded p-2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* <Button className='ml-4' variant="outlined" onClick={() => handleClickOpen()}>
            Crear Producto
          </Button> */}

        </div>
        <DataTable
          columns={columns}
          data={filteredData}
          pagination
          highlightOnHover
        />
        <LoadingSpinnerScreen open={openLoadingSpinner} />

      </div>

      <DialogEditarUsuario
        openDialog={openEditUsuario}
        onClose={handleCloseEditUsuario}
        usuario={usuarioEditar}
        entidades={entidades}
      />
    </>
  )
}
