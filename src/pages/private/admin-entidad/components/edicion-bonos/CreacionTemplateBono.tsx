import React, { useEffect, useState } from 'react'
import TemplateEditor from '../../../../../components/ckeditor/TemplateEditor';
import { Button, ButtonGroup, Divider, Stack } from '@mui/material';
import Swal from 'sweetalert2';
import { cargosPorEntidad, detalleCargoEntidad, generarBonosTemplateCargoBono, guardarTemplateCargoBono, obtenerTemplateCargoBono } from '../../../../../actions/entidad/entidad';
import { ICargoBonoProducto, ITemplateBono } from '../../../../../interfaces/entidad.interface';
import LoadingSpinnerScreen from '../../../../../components/loadingSpinnerScreen/LoadingSpinnerScreen';
import { IoDocuments, IoEye, IoSave } from 'react-icons/io5';


interface Props {
    codEntidad: number
}

export const CreacionTemplateBono = ({ codEntidad }: Props) => {
    const [openLoadingSpinner, setLoadingSpinner] = useState<boolean>(false)
    const [cargos, setCargos] = useState<{ cod_cargo_entidad: number, nombre: string, lote: number }[]>([])
    const [cargosProductos, setCargosProductos] = useState<ICargoBonoProducto[]>([])
    const [selectedCargosProductos, setSelectedCargosProductos] = useState<ICargoBonoProducto | null>()
    const [selectedCodTemplate, setSelectedCodTemplate] = useState<number>(0)
    const [selectedCargoNombre, setSelectedCargoNombre] = useState<string>('')
    const tags = ['nombre','sexo','cedula','codigo','entidad','cargo','lote','valor','producto_dotacion','nit','no_contrato','fecha_inicio','fecha_final']


    useEffect(() => {
        getCargos()
    }, [codEntidad])

    const [html, setHtml] = useState('');
    const handlePreview = () => {
        const previewWindow = window.open('', '_blank');

        if (!previewWindow) return;

        previewWindow.document.write(`
            <html>
            <head>
            <style>

            *{
                box-sizing:border-box;
            }

            body{
                margin:0;
                padding:30px;
                background:#f5f5f5;
                display:flex;
                justify-content:center;
            }

            .page{
                width:816px;
                min-height:1056px;
                background:white;
                box-shadow:0 0 10px rgba(0,0,0,.15);
            }

            p{
                margin:0;
            }

            h1,h2,h3,h4,h5,h6{
                margin:0;
            }

            figure{
                margin:0;
            }

            .image_resized{
                margin:0;
            }

            img{
                max-width:100%;
            }

            </style>
            </head>
            <body>
            <div class="page">
            ${html}
            </div>
            </body>
            </html>
        `);

        previewWindow.document.close();
    };


    const getCargos = async () => {
        try {
            setLoadingSpinner(true)
            let response = await cargosPorEntidad(+codEntidad)
            setLoadingSpinner(false)
            if (response?.error == 0) {
                setCargos(response.cargos)
            } else if (response?.error == 1) {
                Swal.fire(response.msg)
            }
        } catch (e) {
            Swal.fire({
                icon: 'error',
                text: 'Error al consultar los cargos'
            })
        }

    }

    const handleObtenerDetalleCargo = async (codCargoEntidad: number) => {
        try {
            setSelectedCargosProductos(null)
            setCargosProductos([])

            const cargoSelecctionado = cargos.filter((cargo)=>cargo.cod_cargo_entidad == codCargoEntidad)
            if(cargoSelecctionado.length > 0){
                setSelectedCargoNombre(`${cargoSelecctionado[0].nombre} - LOTE ${cargoSelecctionado[0].lote} => ` )
            }
           
            setLoadingSpinner(true)
            let response = await detalleCargoEntidad(codCargoEntidad)
            setLoadingSpinner(false)
            if (response?.error === 0 && response.cargo.cod_cargo_bonos_producto) {
                setCargosProductos(response.cargo.cod_cargo_bonos_producto)
            } else {
                setCargosProductos([])
            }
        } catch (e) {
            Swal.fire({
                icon: 'error',
                text: 'Error al obtener detalles del cargo'
            })
        }

    }

    const handleAbrirTemplate = async (cargoBonoProducto: ICargoBonoProducto) => {
        try {
            setSelectedCargosProductos(cargoBonoProducto)
            setLoadingSpinner(true)
            let response = await obtenerTemplateCargoBono(cargoBonoProducto.cod_cargo_bonos_producto)
            setLoadingSpinner(false)
            if (response?.error === 0) {
                setSelectedCodTemplate(response.cod_template_cargo_bonos_producto)
                setHtml(response.template)
            } else {
                Swal.fire(response!.msg)
            }
        } catch (e) {
            Swal.fire({
                icon: 'error',
                text: 'Error al obtener las subcategorias asociadas'
            })
        }
    }

    const handleGenerarBonos = async () => {
        try {
            setLoadingSpinner(true)
            await generarBonosTemplateCargoBono(selectedCodTemplate)
            setLoadingSpinner(false)

        } catch (e) {
            Swal.fire({
                icon: 'error',
                text: 'Error al generar los bonos'
            })
        }
    }

    const guardarTemplate = async () => {
        try {

            
            setLoadingSpinner(true)
            const templateBono: ITemplateBono = {
                template: html,
                cod_cargo_bonos_producto: selectedCargosProductos?.cod_cargo_bonos_producto
            }
            let response = await guardarTemplateCargoBono(selectedCodTemplate, templateBono)
            setLoadingSpinner(false)
            setSelectedCodTemplate(response!.cod_template)
            Swal.fire(response!.msg)

        } catch (e) {
            Swal.fire({
                icon: 'error',
                text: 'Error al obtener las subcategorias asociadas'
            })
        }
    }
    return (
        <>

            <div className='pe-5'>
                <p className='my-6 font-semibold'>{selectedCargoNombre} { selectedCargosProductos ? selectedCargosProductos.nombre : ''}</p>
                <ButtonGroup variant="outlined" aria-label="Cargos">
                    {

                        cargos.map((cargo) => (
                            <Button
                                key={cargo.cod_cargo_entidad}
                                onClick={() => handleObtenerDetalleCargo(cargo.cod_cargo_entidad)}
                            > {cargo.nombre} - LOTE {cargo.lote}</Button>
                        ))
                    }
                </ButtonGroup>

                <br />
                <br />
                <Divider />
                <br />
                {
                    cargosProductos.length > 0 &&
                    <ButtonGroup variant="outlined" aria-label="Cargos">
                        {
                            cargosProductos.map((cargoProducto) => (
                                <Button
                                    key={cargoProducto.cod_cargo_bonos_producto}
                                    onClick={() => handleAbrirTemplate(cargoProducto)}
                                > {cargoProducto.nombre}</Button>
                            ))
                        }
                    </ButtonGroup>
                }
            </div>

            <br />
            <Divider />
            <br />

            {
                selectedCargosProductos &&
                <>
                    <Stack direction="row" spacing={2} className='mb-3'>
                        <Button variant="outlined" startIcon={<IoEye />} onClick={handlePreview}>
                            Vista previa
                        </Button>
                        <Button variant="contained" startIcon={<IoSave />} onClick={guardarTemplate}>
                            Guardar Template
                        </Button>

                    {
                        selectedCodTemplate &&  <Button variant="contained" startIcon={<IoDocuments />} onClick={handleGenerarBonos}>
                            Generar bonos PDF
                        </Button>
                    }
                       
                        
                    </Stack>
                    
                    <TemplateEditor
                        value={html}
                        onChange={setHtml}
                        tags={tags}
                    />
                </>
            }

            <hr />

            <LoadingSpinnerScreen open={openLoadingSpinner} />
        </>
    )
}
