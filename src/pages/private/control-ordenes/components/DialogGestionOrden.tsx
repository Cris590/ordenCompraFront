import { Button, Dialog, DialogActions, DialogContent, DialogTitle, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React, { useEffect } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { editarEntidad } from '../../../../actions/entidad/entidad';
interface Props {
  openDialog: boolean;
  codEntidad: number;
  onClose: (gestionarOrden: boolean) => void;
}

interface IGestion {
  entrega_bonos: 'FISICO' | 'VIRTUAL',
  direccion:string,
  ciudad:string
}

export const DialogGestionOrden = ({ openDialog, onClose, codEntidad }: Props) => {
  const { handleSubmit, reset, control, formState: { isValid } } = useForm<IGestion>({
    defaultValues: { entrega_bonos: 'VIRTUAL' }
  });

  useEffect(() => {
    reset({ entrega_bonos: 'VIRTUAL' })

  }, [openDialog])

  const onSubmit: SubmitHandler<IGestion> = async (data) => {
    actualizarEntidad(data)
  }



  const actualizarEntidad = async (data: IGestion) => {
    try {

      let res = await editarEntidad(data, codEntidad)
      if (res) {
        Swal.fire(res.msg)
        if (res?.error == 0) {
          onClose(true)
        }
      }
      onClose(false)

    } catch (e) {
      Swal.fire({
        icon: "error",
        text: "Comuniquese con el administrador"
      })
    }
  }


  return (
    <Dialog
      open={openDialog}
      onClose={() => onClose(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        Gestion de orden
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)} >
        <DialogContent>
          <div className="flex flex-col">


            <Controller
              name="entrega_bonos"
              control={control}
              render={({ field }) => (
                <>
                  <InputLabel id="entrega_bonos" className='my-1'>Seleccione el tipo de entrega de los bonos</InputLabel>
                  <Select
                    labelId="entrega_bonos"
                    {...field}
                    label="Tipo de entrega"
                  >
                    <MenuItem value={'FISICO'}>Físico</MenuItem>
                    <MenuItem value={'VIRTUAL'}>Virtual</MenuItem>
                  </Select>
                </>
              )}
            />

            <br />
            <Controller
              name="direccion"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  label="direccion"
                  variant="outlined"
                  {...field}
                  value={field.value || ''}
                />
              )}
            />
            <br />
            <Controller
              name="ciudad"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  label="ciudad"
                  variant="outlined"
                  {...field}
                  value={field.value || ''}
                />
              )}
            />
            <br />
          </div>

        </DialogContent>

        <DialogActions>
          <Button onClick={() => onClose(false)}>Cancelar</Button>
          <Button disabled={!isValid} type='submit'>
            Gestionar Orden de compra
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
