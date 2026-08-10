import React, { useEffect, useState } from 'react';
import LoadingSpinnerScreen from '../../../../../../components/loadingSpinnerScreen/LoadingSpinnerScreen';
import {
  Button,
  Dialog,
  DialogContent,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from '@mui/material';
import { IoAddCircleOutline, IoClose, IoEye } from 'react-icons/io5';

import { ITallajeResumen } from '../../../../../../interfaces/tallaje.interface';
import { IEditarProductoModeloCrm } from '../../../../../../interfaces/ecommerce.interface';

import {
  obtenerTallajesActivosCrm,
  obtenerTallasProductoCrm
} from '../../../../../../actions/ecommerce/ecommerce';


interface Props {
  producto: IEditarProductoModeloCrm;
  onChange: (
    data: any,
    valid: boolean
  ) => void;
}


export const StepTallajeProducto = ({ onChange, producto }: Props) => {


  const [tallas, setTallas] = useState<string[]>([]);

  // Cantidad de tallas que vienen desde BD
  const [tallasCreadas, setTallasCreadas] = useState<string[]>([]);
  const [cantidadTallasCreadas, setCantidadTallasCreadas] = useState(0);
  const [openLoadingSpinner, setLoadingSpinner] = useState<boolean>(false);
  const [tallajes, setTallajes] = useState<ITallajeResumen[]>([]);
  const [tallajeSeleccionado, setTallajeSeleccionado] = useState<number>(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);


  useEffect(() => {

    obtenerTallajes();
    tallasPorProducto();

  }, []);



  const tallasPorProducto = async () => {

    if (!producto.codigo_modelo) {
      return;
    }

    setLoadingSpinner(true);

    const response = await obtenerTallasProductoCrm(
      producto.codigo_modelo
    );


    const tallasBD = response?.tallas || [];


    setTallasCreadas(tallasBD);


    // acá vienen las del padre
    const tallasActuales = producto.tallas || [];


    setTallas(
      tallasActuales.length > 0
        ? tallasActuales
        : tallasBD
    );
    setTallajeSeleccionado(producto.cod_tallaje? producto.cod_tallaje : response?.cod_tallaje || 0);
    setLoadingSpinner(false);
  };


  const obtenerTallajes = async () => {

    try {
      setLoadingSpinner(true);
      const response = await obtenerTallajesActivosCrm();
      setTallajes(response?.tallajes || []);
      setLoadingSpinner(false);

    } catch (e) {

      setLoadingSpinner(false);

    }
  };




  /**
   * Indica si la talla pertenece
   * al producto original
   */
  const esTallaCreada = (talla: string) => {
    return tallasCreadas.includes(talla);
  };

  /**
   * Validación:
   * - No puede repetirse dentro del formulario
   * - No puede existir una nueva igual a una creada
   */
  const tallaDuplicada = (talla: string, index: number) => {

    if (!talla) {
      return false;
    }

    return tallas.some((item, i) => item === talla && i !== index);

  };


  const allInputsFilled =
    tallas.every(talla => talla.length === 2) &&
    tallas.every((talla, index) => !tallaDuplicada(talla, index));


  useEffect(() => {

    const valid =
      tallas.length > 0 &&
      !!tallajeSeleccionado &&
      allInputsFilled;

    onChange(
      {
        tallas,
        cod_tallaje: tallajeSeleccionado
      },
      valid
    );
  }, [
    tallas,
    tallajeSeleccionado,
    allInputsFilled
  ]);




  const handleTallaChange = (index: number, value: string) => {

    const nuevasTallas = [...tallas];
    nuevasTallas[index] = value;
    setTallas(nuevasTallas);
  };



  const handleAgregarTalla = () => {

    if (!allInputsFilled) return;

    setTallas([
      ...tallas,
      ''
    ]);

  };



  const handleRemoverTalla = (index: number) => {
    const talla = tallas[index];
    if (esTallaCreada(talla)) return;
    setTallas(
        tallas.filter(
            (_, i) => i !== index
        )
    );
};

  const getImagenTallaje = () => {
    const imagen =
      tallajes.find(
        tallaje =>
          tallajeSeleccionado === tallaje.cod_tallaje
      );
    return imagen?.imagen || '';
  };



  return (
    <>

      <div className="flex flex-row">
        <div className="max-w-[70%]">
          <p className="font-semibold my-4">
            Selección de Tallas
          </p>
          <div className="flex justify-start flex-wrap my-5">
            {tallas.map((input, index) => (
              <div
                key={index}
                className="flex items-center my-3"
              >
                <TextField
                  label={`Talla ${index + 1}`}
                  variant="outlined"
                  value={input}
                  disabled={esTallaCreada(input)}
                  error={tallaDuplicada(input, index)}
                  helperText={tallaDuplicada(input, index) ? "Esta talla ya existe" : ""}
                  onChange={(e) => handleTallaChange(index, e.target.value)}

                  inputProps={{
                    maxLength: 2,
                    minLength: 2
                  }}

                  style={{
                    marginRight: '8px',
                    width: '80px'
                  }}

                />


                {
                  !esTallaCreada(input) &&
                  <IconButton
                    size="small"
                    onClick={() => handleRemoverTalla(index)}
                    color="secondary"
                  >
                    <IoClose />
                  </IconButton>
                }

              </div>
            ))}
          </div>

          <Button
            variant="contained"
            size="small"
            endIcon={<IoAddCircleOutline />}
            onClick={handleAgregarTalla}
            disabled={!allInputsFilled}
          >
            Agregar Talla
          </Button>
        </div>

        <div className="px-10 ml-10 border-l-2 border-gray-300">
          <p className="font-semibold my-4">
            Selección de tallaje
          </p>
          <InputLabel>
            Seleccione el tallaje
          </InputLabel>
          <Select
            value={tallajeSeleccionado}
            onChange={(event) => setTallajeSeleccionado(+event.target.value)}
          >
            {
              tallajes.map(tallaje => (
                <MenuItem
                  key={tallaje.cod_tallaje}
                  value={tallaje.cod_tallaje}
                >
                  {tallaje.nombre}
                </MenuItem>

              ))
            }


          </Select>

          <IconButton
            color="primary"
            onClick={() => setIsDialogOpen(true)}
          >
            <IoEye />
          </IconButton>
        </div>
      </div>


      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          <img
            src={getImagenTallaje()}
            alt="Tallaje"
            style={{
              width: '100%'
            }}
          />

        </DialogContent>
      </Dialog>

      <LoadingSpinnerScreen
        open={openLoadingSpinner}
      />


    </>
  );
};