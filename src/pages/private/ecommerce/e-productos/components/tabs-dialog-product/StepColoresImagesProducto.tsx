import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { IActualizarProductoColorCrm, IColorProductoCrm, ICrearColorProductoCrm, IEditarProductoModeloCrm, IProductoResumenCrm } from '../../../../../../interfaces/ecommerce.interface';
import { borrarImagenProductoCrm, crearColorProductoCrm, editarColorProductoCrm, obtenerColoresProductoCrm, obtenerImagenesColoresProductoCrm, subirImagenProductoCrm } from '../../../../../../actions/ecommerce/ecommerce';
import Swal from 'sweetalert2';
import { Alert, AlertTitle, Button, Card, Input, Stack, Typography } from '@mui/material';
import { ColorAccionCircleCrm } from './ColorAccionCircleCrm';
import LoadingSpinnerScreen from '../../../../../../components/loadingSpinnerScreen/LoadingSpinnerScreen';
import { DialogColorFormCrm } from './DialogColorFormCrm';
import { IoCloudUploadSharp } from 'react-icons/io5';
import { IProductoColorImagen } from '../../../../../../interfaces/producto.interface';
import { ImagenProductoCargada } from '../../../../editar-producto/components/ImagenProductoCargada';
import { useProductoEdicionStore } from '../../../../../../store/ecommerce/producto-edicion';

interface Props {
  producto: IEditarProductoModeloCrm,
  onChange: (
    data: any,
    valid: boolean
  ) => void;
}

const colorProductoCrmInicial: ICrearColorProductoCrm = {
  color: '#FFFFFF',
  codigo_color: '',
  nombre_color: ''
}


export const StepColoresImagesProducto = ({ onChange, producto}: Props) => {
  const [loadingSpinner, setLoadingSpinner] = useState(false)
  const [colores, setColores] = useState<IColorProductoCrm[]>([])
  const [coloresParaCrear, setColoresParaCrear] = useState<string[]>([])
  const [colorEditar, setColorEditar] = useState<ICrearColorProductoCrm>(colorProductoCrmInicial)
  const [openDialogColorForm, setOpenDialogColorForm] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagenesColor, setImagenesColor] = useState<IProductoColorImagen[]>([])
  const [currentColor, setCurrentColor] = useState<IColorProductoCrm>()

  /** Store producto */
  // const producto = useProductoEdicionStore((state) => state.producto)

  useEffect(() => {
    obtenerColoresProducto() 
  }, [])

  useEffect(() => {
    actualizarPadre()
  }, [coloresParaCrear, colores])
  

  const obtenerColoresProducto = async () => {
    try {
      setLoadingSpinner(true)
      let response = await obtenerColoresProductoCrm(producto.codigo_modelo)
      setLoadingSpinner(false)

      if (response?.error == 0) {
        setColores(response.colores)
        setColoresParaCrear(response.coloresParaCrear)
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


  const seleccionarColor = (color: IColorProductoCrm) => {
    console.log('Seleccionar producto', color)
    setCurrentColor(color)
    getImagenesPorColores(color.cod_producto_color)
  }

  const hanleEditarColor = (color: IColorProductoCrm) => {
    console.log('Editar producto', color)
    setColorEditar({
      cod_producto_color: color.cod_producto_color,
      codigo_color: color.codigo_color,
      nombre_color: color.nombre_color,
      color: color.color
    })
    setOpenDialogColorForm(true)
  }

  const borrarColor = (producto: IColorProductoCrm) => {
    console.log('Borrar color', producto)
  }

  const handleCrearColor = (codigo_color?: string) => {
    console.log('Crear Color ', codigo_color)

    setColorEditar({
      ...colorProductoCrmInicial,
      codigo_color: codigo_color || ''
    })
    setOpenDialogColorForm(true)
  }

  const handleSubmitDialogColorForm = (colorParcial: ICrearColorProductoCrm) => {

    if (colorParcial.cod_producto_color) {
      editarColor(colorParcial)
    } else {
      crearColorCm(colorParcial)
    }
  }

  const crearColorCm = async (colorParcial: ICrearColorProductoCrm) => {
    try {
      setLoadingSpinner(true)
      let response = await crearColorProductoCrm(colorParcial, producto.codigo_modelo)
      setLoadingSpinner(false)

      Swal.fire(response!.msg)
      setCurrentColor(undefined)
      setImagenesColor([])
      obtenerColoresProducto()
    }
    catch (e) {
      Swal.fire({
        icon: 'error',
        text: 'Error al consultar las categorias'
      })
    }
  }



  const editarColor = async (colorParcial: ICrearColorProductoCrm) => {
    try {
      const color: IActualizarProductoColorCrm = {
        color: colorParcial.color,
        codigo_color: colorParcial.codigo_color,
        nombre_color: colorParcial.nombre_color
      }
      const id = (colorParcial.cod_producto_color) ? colorParcial.cod_producto_color : 0

      setLoadingSpinner(true)
      let response = await editarColorProductoCrm(id, color)
      setLoadingSpinner(false)

      Swal.fire(response!.msg)
      setCurrentColor(undefined)
      setImagenesColor([])
      obtenerColoresProducto()
    }
    catch (e) {
      Swal.fire({
        icon: 'error',
        text: 'Error al consultar las categorias'
      })
    }
  }

  // ACCIONES IMAGENES

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null; // Safely access the file
    setSelectedFile(file);
  };

  const handleSubmitCargarImagen = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedFile) {
      alert("Por favor seleccione una imagen");
      return;
    }

    const formData = new FormData();
    formData.append('imagen', selectedFile);
    formData.append('cod_producto_color', String(currentColor?.cod_producto_color))
    setLoadingSpinner(true)
    let response = await subirImagenProductoCrm(formData)
    setLoadingSpinner(false)

    if (response?.error === 0) {

      getImagenesPorColores(currentColor!.cod_producto_color)
      setSelectedFile(null)
    }
  };

  const borrarImagen = async (imagenBorrar: { cod_producto_color_imagen: number, url: string }) => {

    setLoadingSpinner(true)
    let response = await borrarImagenProductoCrm(imagenBorrar);
    setLoadingSpinner(false)
    if (response) {

      Swal.fire(response.msg)
      if (response.error === 0) {
        getImagenesPorColores(currentColor?.cod_producto_color || 0)
      }
    }
  }

  const getImagenesPorColores = async (codProductoColor: number) => {
    setLoadingSpinner(true)
    let response = await obtenerImagenesColoresProductoCrm(codProductoColor)
    setLoadingSpinner(false)
    setImagenesColor(response?.imagenes || [])

  }

  const actualizarPadre = ()=>{
    const valid = coloresParaCrear.length == 0 && colores.length >0
    const coloresCreacion = colores.map((color)=>color.codigo_color)
    onChange({
      colores:coloresCreacion
    },valid)
  }


  return (
    <>
      <Card className="p-6">

        <Typography variant="h5" fontWeight={600}>
          Información de los colores de los productos
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          className="mb-6"
        >
          Complete la información de los productos.
        </Typography>
        <div className='w-full my-3'>

          {
            coloresParaCrear.length > 0 ? (
              <Alert
                severity="warning"
                sx={{
                  mb: 3,
                  borderRadius: 2,
                }}
              >
                <AlertTitle>Colores pendientes por crear</AlertTitle>

                <Typography variant="body2" sx={{ mb: 2 }}>
                  Se detectaron colores disponibles para este producto que aún no han sido
                  configurados. Debes crear cada uno antes de poder administrar sus
                  imágenes y demás información.
                </Typography>

                <Stack
                  direction="row"
                  spacing={1}
                  flexWrap="wrap"
                  useFlexGap
                >
                  {coloresParaCrear.map((color) => (
                    <Button
                      key={color}
                      variant="contained"
                      color="warning"
                      onClick={() => handleCrearColor(color)}
                    >
                      Crear color {color}
                    </Button>
                  ))}
                </Stack>
              </Alert>
            ) : (
              <Button color='primary' variant='contained' onClick={() => handleCrearColor()}>
                Agregar Color
              </Button>
            )
          }

          <div className=" mt-4 py-5 flex justify-start row">
            {colores.map((colorUnitario, index) => (

              <ColorAccionCircleCrm
                selected={colorUnitario.cod_producto_color === currentColor?.cod_producto_color}
                key={colorUnitario.cod_producto_color}
                colorUnitario={colorUnitario}
                seleccionarColor={seleccionarColor}
                editarColor={hanleEditarColor}
                borrarColor={borrarColor}
              />
            ))}
          </div>
          {(currentColor && currentColor?.cod_producto_color !== 0) && (
            <form onSubmit={handleSubmitCargarImagen}>
              <label htmlFor="file-upload" className="mx-3">
                <Button
                  variant="outlined"
                  component="span"
                >
                  Escoger Imagen

                  <Input
                    id="file-upload"
                    type="file"
                    inputProps={{ accept: 'image/*' }}
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                </Button>
                {selectedFile && (
                  <span className="mx-1">
                    {selectedFile.name}
                  </span>
                )}
              </label>
              <Button className="mx-3" type="submit" variant="contained" endIcon={<IoCloudUploadSharp />}>
                Cargar Imagen
              </Button>
            </form>
          )}

          <div className="flex justify-start mt-6">
            {
              imagenesColor.map((imagen) => (

                <ImagenProductoCargada
                  key={imagen.cod_producto_color_imagen}
                  url={imagen.url}
                  cod_producto_color_imagen={imagen.cod_producto_color_imagen}
                  borrarImagen={borrarImagen}
                />

              ))
            }
          </div>
        </div>
      </Card>

      <LoadingSpinnerScreen open={loadingSpinner} />

      <DialogColorFormCrm
        open={openDialogColorForm}
        onClose={() => {
          setOpenDialogColorForm(false)
          setCurrentColor(undefined)
        }}
        onSubmit={handleSubmitDialogColorForm}
        colorInicial={colorEditar}
      />
    </>

  )
}
