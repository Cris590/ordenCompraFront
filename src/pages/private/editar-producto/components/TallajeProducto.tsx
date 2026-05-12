import React, { useEffect, useState } from 'react'

import { TextField, Button, IconButton, FormControlLabel, Switch, InputLabel, Select, MenuItem, Dialog, DialogContent } from '@mui/material';
import { IoAddCircleOutline, IoClose, IoCloudUploadSharp, IoEye } from 'react-icons/io5';
import LoadingSpinnerScreen from '../../../../components/loadingSpinnerScreen/LoadingSpinnerScreen';
import { editarProducto, obtenerTallasProducto } from '../../../../actions/producto/producto';
import Swal from 'sweetalert2';
import { obtenerTallajesActivos } from '../../../../actions/tallaje/tallaje';
import { ITallajeResumen } from '../../../../interfaces/tallaje.interface';


interface Props {
    codProducto: string
}

export const TallajeProducto = ({ codProducto }: Props) => {


    const [tallas, setTallas] = useState<string[]>(['']);
    const [tieneTalla, setTieneTalla] = useState<boolean>(false)
    const [openLoadingSpinner, setLoadingSpinner] = useState<boolean>(false)
    const [tallajes, setTallajes] = useState<ITallajeResumen[]>([]);
    const [tallajeSeleccionado, setTallajeSeleccionado] = useState<number>(0);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        obtenerTallajes()
        coloresPorProducto()
    }, [codProducto])


    const coloresPorProducto = async () => {
        if (codProducto) {
            setLoadingSpinner(true)
            let response = await obtenerTallasProducto(codProducto)
            setTieneTalla(!!response?.tiene_talla)
            setTallajeSeleccionado(response?.cod_tallaje || 0)
            setTallas(response?.tallas || [])
            setLoadingSpinner(false)
        }
    }

    const obtenerTallajes = async () => {
        try {
            setLoadingSpinner(true)
            let response = await obtenerTallajesActivos()
            setTallajes(response?.tallajes || [])
            setLoadingSpinner(false)
        } catch (e) {

        }
    }

    const handleTallaChange = (index: number, value: string) => {
        const newInputs = [...tallas];
        newInputs[index] = value;
        setTallas(newInputs);
    };

    const handleAgregarTalla = () => {
        setTallas([...tallas, '']);
    };

    const handleRemoverTalla = (index: number) => {
        const newInputs = tallas.filter((_, i) => i !== index);
        setTallas(newInputs);
    };


    // Check if all inputs are filled
    const allInputsFilled = tallas.every(input => input.length > 0);

    const toogleTieneTalla = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setLoadingSpinner(true)
        let response = await editarProducto({ tiene_talla: event.target.checked }, +codProducto);
        if (response?.error === 0) {
            setTieneTalla(!event.target.checked)
        }
        setLoadingSpinner(false)
    }

    const handleGuardarTallasProducto = async () => {
        setLoadingSpinner(true)
        let response = await editarProducto({ talla: tallas }, +codProducto);
        if (response?.error === 0) {
            if (response) {
                Swal.fire(response.msg)
            }
        }
        setLoadingSpinner(false)
    }

    const handleChangeTallaje = async (event: any) => {
        setTallajeSeleccionado(+event.target.value)
        setLoadingSpinner(true)
        let response = await editarProducto({ cod_tallaje: +event.target.value }, +codProducto);
        if (response?.error === 0) {
            if (response) {
                Swal.fire(response.msg)
            }
        }
        setLoadingSpinner(false)
    }

    const getImagenTallaje = () => {
        let imagenFilter = tallajes.filter((tallaje) => tallajeSeleccionado === tallaje.cod_tallaje)

        return (imagenFilter.length > 0) ? imagenFilter[0].imagen : ''
    }

    return (
        <>
            <div className="mx-4 w-auto my-6">
                <FormControlLabel
                    control={<Switch
                        checked={tieneTalla}
                        onChange={toogleTieneTalla}
                        inputProps={{ 'aria-label': 'controlled' }}
                    />} label="Tiene Talla ?"
                />
            </div>

            {
                tieneTalla && (
                    <>
                        <div className='flex flox-row'>


                            <div className='max-w-[70%] '>
                                <p className='font-semibold font-md my-4'> Seleccion de Tallas </p>
                                <div className='flex justify-start flex-wrap my-5'>
                                    {tallas.map((input, index) => (
                                        <div key={index} className=" flex row justify-start my-3" >
                                            <TextField
                                                label={`Talla ${index + 1}`}
                                                variant="outlined"
                                                value={input}
                                                onChange={(e) => handleTallaChange(index, e.target.value)}
                                                inputProps={{ maxLength: 4 }}
                                                style={{ marginRight: '8px', width: '80px' }}
                                            />
                                            <IconButton
                                                size="small"
                                                onClick={() => handleRemoverTalla(index)}
                                                color="secondary"
                                                aria-label="delete"
                                            >
                                                <IoClose />
                                            </IconButton>
                                        </div>
                                    ))}

                                </div>
                                <Button variant="contained" color="primary"
                                    size="small"
                                    type="button" endIcon={<IoAddCircleOutline />}
                                    onClick={handleAgregarTalla} disabled={!allInputsFilled}>
                                    Agregar Talla
                                </Button>
                                <div className='my-5'>
                                    <Button variant="contained" color="secondary"
                                        type="button" endIcon={<IoCloudUploadSharp />}
                                        onClick={handleGuardarTallasProducto} disabled={!allInputsFilled}
                                        size="small"
                                    >
                                        Guardar tallas
                                    </Button>
                                </div>
                            </div>

                            <div className='px-10 ml-10 border-l-2 border-gray-300'>
                                    <p className='font-semibold font-md my-4'> Seleccion de tallaje </p>
                                <InputLabel id="tallaje" className='mt-4'>Seleccione el tallaje</InputLabel>
                                <Select
                                    label="tallaje"
                                    labelId="tallaje"
                                    onChange={handleChangeTallaje}
                                    value={tallajeSeleccionado}
                                >
                                    {tallajes.map((tallaje) => (<MenuItem key={tallaje.cod_tallaje} value={tallaje.cod_tallaje}>{tallaje.nombre}</MenuItem>))}
                                </Select>

                                <IconButton aria-label="ver tallaje" color="primary" onClick={() => setIsDialogOpen(true)}>
                                    <IoEye />
                                </IconButton>
                            </div>

                        </div>


                        {/* Dialogo de la imagen del tallaje */}

                        <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} maxWidth="md" fullWidth>
                            <DialogContent>
                                <img src={getImagenTallaje()} alt={`Image`} style={{ width: '100%' }} />
                            </DialogContent>
                        </Dialog>

                    </>
                )
            }

            <LoadingSpinnerScreen open={openLoadingSpinner} />
        </>
    );
}
