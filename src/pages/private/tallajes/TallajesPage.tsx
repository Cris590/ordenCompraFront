import { useEffect, useState } from "react";
import { ITallajeResumen } from "../../../interfaces/tallaje.interface";
import DataTable from "react-data-table-component";
import { Button } from "@mui/material";
import { Title } from "../../../components/title/Title";
import { obtenerTallajes } from "../../../actions/tallaje/tallaje";
import { FormTallaje } from "./ui/FormTallaje";
import { useFilteredData } from "../../../hooks/useFilteredData";

const tallajeInicial: ITallajeResumen = {
  cod_tallaje: 0,
  nombre: '',
  activo: 0,
  imagen: ''
}

export const TallajesPage = () => {


  const [open, setOpen] = useState(false);
  const [currentTalla, setCurrentTalla] = useState<ITallajeResumen>(tallajeInicial);
  const [tallas, setTallas] = useState<ITallajeResumen[]>([]);
  const { search, setSearch, filteredData } = useFilteredData(tallas);

  const columns = [
    {
      name: 'Nombre',
      selector: (row: ITallajeResumen) => row.nombre,
    },
    {
      name: 'Estado',
      selector: (row: ITallajeResumen) => (row.activo === 1) ? 'Activo' : 'Inactivo',
    },
    {
      name: 'Actions',
      cell: (row: ITallajeResumen) => (
        <button
          onClick={() => handleClickOpen(row)}
          className="bg-blue-500 text-white px-2 py-1 rounded"
        >
          Editar
        </button>
      ),
    },
  ];

  useEffect(() => {
    obtenerTodosProductos()
  }, [])

  const obtenerTodosProductos = async () => {
    let response = await obtenerTallajes()
    if (response?.error == 0) {
      setTallas(response.tallajes)
    }
  }


  const handleClickOpen = (tallaje: ITallajeResumen) => {
    setCurrentTalla(tallaje)
    setOpen(true)
  };

  const handleCloseFormTallaje = (actualizar: boolean) => {
    if (actualizar) {
      obtenerTodosProductos()
    }
    setOpen(false);
  };

  return (
    <>
      <div className="container mx-auto p-4">
        <Title title="Tallajes" />
        <div className="mb-4">
          <input
            type="text"
            placeholder="Buscar..."
            className="border rounded p-2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Button className='ml-4' variant="outlined" onClick={() => handleClickOpen(tallajeInicial)}>
            Crear Tallaje
          </Button>

        </div>
        <DataTable
          columns={columns}
          data={filteredData}
          pagination
          highlightOnHover
        />


        <FormTallaje
          openDialog={open}
          onClose={handleCloseFormTallaje}
          tallaje={currentTalla}
        />

      </div>

    </>
  );
}