import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Step, StepLabel, Stepper } from '@mui/material';

import { StepConfiguracionProductoGeneral } from './StepConfiguracionProductoGeneral';
import { StepColoresImagesProducto } from './StepColoresImagesProducto';
import { StepTallajeProducto } from './StepTallajeProducto';

import { IProductoResumenCrm } from '../../../../../../interfaces/ecommerce.interface';
import { crearProductoCrm, editarProductoCrm } from '../../../../../../actions/ecommerce/ecommerce';
import LoadingSpinnerScreen from '../../../../../../components/loadingSpinnerScreen/LoadingSpinnerScreen';
import Swal from 'sweetalert2';
import { useProductoEdicionStore } from '../../../../../../store/ecommerce/producto-edicion';

interface Props {
    onClose: (actualizar: boolean) => void
}

interface IActualizacionFormProductoGeneral {
    id_categoria: number,
    id_sub_categoria: number,
    activo: 1 | 0,
    descripcion: string,
    precio_compra: number,
    precio_venta: number,
    lote: string,
    codigo_modelo?: string
}

interface IStepsData {
    general: {
        valid: boolean;
    };
    colores: {
        valid: boolean;
    };
    tallas: {
        valid: boolean;
    };
}

export const StepsConfiguracionProducto = ({ onClose }: Props) => {
    // const [productoModificado, setProductoModificado] = useState<IProductoResumenCrm>()
    const [activeStep, setActiveStep] = useState(0);
    const [openLoadingSpinner, setLoadingSpinner] = useState<boolean>(false)

    /** Store producto */
    const producto = useProductoEdicionStore((state) => state.producto)
    const setProductoSeleccionado = useProductoEdicionStore((state) => state.setEdicionProducto)

    const [productoEdicion, setProductoEdicion] = useState<IProductoResumenCrm>(producto);


    const [stepsData, setStepsData] = useState<IStepsData>({
        general: {
            valid: false
        },
        colores: {
            valid: false
        },
        tallas: {
            valid: false
        }
    });

    const onChangeStep1 = (
        data: IActualizacionFormProductoGeneral,
        valid: boolean
    ) => {
        const categoria = String(data.id_categoria).padStart(2, '0');

        const subCategoria = String(data.id_sub_categoria);

        let subCategoriaInicio: string;
        let subCategoriaFin: string;

        if (subCategoria.length <= 2) {
            subCategoriaInicio = subCategoria.padStart(2, '0');
            subCategoriaFin = '00';
        } else {
            subCategoriaInicio = subCategoria.slice(0, 2);
            subCategoriaFin = subCategoria.slice(2).padStart(2, '0');
        }

        const lote = String(data.lote).padStart(4, '0');

        const nuevoCodigo = `${categoria}${subCategoriaInicio}CC${subCategoriaFin}TT${lote}`;
        setProductoEdicion(prev => ({
            ...prev,
            ...data,
            codigo_modelo: producto.nuevo_producto ? nuevoCodigo : producto.codigo_modelo
        }));


        setStepsData(prev => ({
            ...prev,
            general: {
                valid
            }
        }));
    }

    const onChangeStep2 = (
        data: any,
        valid: boolean
    ) => {

        setProductoEdicion(prev => ({
            ...prev,
            colores: data.colores
        }));


        setStepsData(prev => ({
            ...prev,
            colores: {
                valid
            }
        }));
    }

    const onChangeStep3 = (
        data: any,
        valid: boolean
    ) => {

        setProductoEdicion(prev => ({
            ...prev,
            tallas: data.tallas,
            cod_tallaje: data.cod_tallaje
        }));

        console.log('Producto edicion -->', productoEdicion)
        setStepsData(prev => ({
            ...prev,
            tallas: {
                valid
            }
        }));
    }

    const nextStep = () => {
        setProductoSeleccionado(productoEdicion);
        if (activeStep < steps.length - 1) {
            setActiveStep(prev => prev + 1);
        } else {
            finalizarConfiguracion();
        }
    };

    const previousStep = () => {
        if (activeStep > 0) {
            setActiveStep(prev => prev - 1);
        }
    };

    const finalizarConfiguracion = async () => {
        const {
            categoria,
            codigo_auxiliar,
            nuevo_producto,
            sub_categoria,
            total_colores,
            total_tallas,
            id_woo_subcategoria,
            ...productoGuardar
        } = productoEdicion;

        try {
            let sincronizar_ecommerce = false;

            if (nuevo_producto) {
                const confirmacion = await Swal.fire({
                    title: '¿Sincronizar con el ecommerce?',
                    text: '¿Deseas sincronizar este producto con el ecommerce al crearlo?',
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonText: 'Sí, sincronizar',
                    cancelButtonText: 'No, solo guardar',
                    reverseButtons: true,
                });

                sincronizar_ecommerce = confirmacion.isConfirmed;
            }else if(id_woo_subcategoria){
                const confirmacion = await Swal.fire({
                    title: '¿Sincronizar con el ecommerce?',
                    text: '¿Deseas sincronizar este producto con el ecommerce al editarlo?',
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonText: 'Sí, sincronizar',
                    cancelButtonText: 'No, solo guardar',
                    reverseButtons: true,
                });

                sincronizar_ecommerce = confirmacion.isConfirmed;
            }

            setLoadingSpinner(true);

            const productoFinal = {
                ...productoGuardar,
                sincronizar_ecommerce,
            };

            const respuesta = nuevo_producto
                ? await crearProductoCrm(productoFinal)
                : await editarProductoCrm(productoFinal);

            Swal.fire(respuesta!.msg);

            onClose(true);

        } catch (error) {
            console.error('Error al finalizar configuración:', error);

            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ocurrió un error al guardar el producto.',
            });

        } finally {
            setLoadingSpinner(false);
        }
    };

    const steps = [
        {
            title: 'Información General',
            valid: stepsData.general.valid,
            component: (
                <StepConfiguracionProductoGeneral
                    producto={producto}
                    onChange={onChangeStep1}
                />
            )
        },
        {
            title: 'Colores / Imágenes',
            valid: stepsData.colores.valid,
            component: (
                <StepColoresImagesProducto
                    producto={producto}
                    onChange={onChangeStep2}
                />
            )
        },
        {
            title: 'Tallaje',
            valid: stepsData.tallas.valid,
            component: (
                <StepTallajeProducto
                    producto={producto}
                    onChange={onChangeStep3}
                />
            )
        }
    ];

    return (
        <>


            <Box width="100%">

                <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                    {steps.map(step => (
                        <Step key={step.title}>
                            <StepLabel>
                                {step.title}
                            </StepLabel>
                        </Step>
                    ))}
                </Stepper>
                {steps[activeStep].component}
                <Box
                    mt={4}
                    display="flex"
                    justifyContent="space-between"
                >
                    <Button
                        disabled={activeStep === 0}
                        onClick={previousStep}
                    >
                        Regresar
                    </Button>

                    <Button
                        variant="contained"
                        onClick={nextStep}
                        disabled={!steps[activeStep].valid}
                    >
                        {activeStep === steps.length - 1
                            ? 'Finalizar'
                            : 'Siguiente'}
                    </Button>
                </Box>

            </Box>

            <LoadingSpinnerScreen open={openLoadingSpinner} />
        </>
    );
};