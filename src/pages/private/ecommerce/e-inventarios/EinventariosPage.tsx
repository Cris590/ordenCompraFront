import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';



import { TablaInventarioEcommerce } from './components/TablaInventarioEcommerce';
import { IInventarioEcommerce } from '../../../../interfaces/ecommerce.interface';
import { useFilteredData } from '../../../../hooks/useFilteredData';
import { obtenerInventarioEcommerce } from '../../../../actions/ecommerce/ecommerce';
import { Title } from '../../../../components/title/Title';
import LoadingSpinnerScreen from '../../../../components/loadingSpinnerScreen/LoadingSpinnerScreen';
import { ModalDetalleInventarioEcommerce } from './components/ModalDetalleInventarioEcommerce';

export const EinventariosPage = () => {

    const [inventarios, setInventarios] = useState<IInventarioEcommerce[]>([]);
    const [openDetalle, setOpenDetalle] = useState(false);
    const [codigoModelo, setCodigoModelo] = useState<string | null>(null);
    const [openLoadingSpinner, setOpenLoadingSpinner] = useState(false);

    const {
        search,
        setSearch,
        filteredData
    } = useFilteredData(inventarios);

    /**
     * Cargar inventario ecommerce
     */
    const cargarInventario = async () => {

        try {

            setOpenLoadingSpinner(true);

            const response = await obtenerInventarioEcommerce();

            if (response?.error === 0) {

                setInventarios(response?.data || []);

            } else {

                setInventarios([]);

                Swal.fire(response!.msg);

            }

        } catch (error) {

            console.error(
                'Error obteniendo inventario ecommerce:',
                error
            );

            setInventarios([]);

            Swal.fire({
                icon: 'error',
                text: 'Error al cargar el inventario ecommerce, contacte con el administrador'
            });

        } finally {

            setOpenLoadingSpinner(false);

        }
    };

    /**
     * Carga inicial
     */
    useEffect(() => {
        cargarInventario();
    }, []);

    /**
     * Ver detalle del modelo
     */
    const handleVerDetalle = (codigoModelo: string) => {

        setCodigoModelo(codigoModelo);
        setOpenDetalle(true);

    };

    /**
     * Cerrar detalle
     */
    const handleCerrarDetalle = () => {

        setOpenDetalle(false);
        setCodigoModelo(null);

    };

    return (
        <>
            <Title title="Inventario Ecommerce" />

            <div className="bg-slate-100 min-h-screen p-2 w-[98%]">

                <div className="bg-white border border-slate-200 rounded-sm shadow-sm">

                    {/* TABLA */}

                    <div className="border-t border-slate-200 p-3">

                        {/* BUSCADOR */}

                        <div className="mb-4">

                            <input
                                type="text"
                                placeholder="Buscar..."
                                className="border rounded p-2"
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                            />

                        </div>

                        <TablaInventarioEcommerce
                            inventarios={filteredData}
                            onVerDetalle={handleVerDetalle}
                        />

                    </div>

                </div>

            </div>

            <ModalDetalleInventarioEcommerce
                open={openDetalle}
                codigoModelo={codigoModelo}
                onClose={handleCerrarDetalle}
            />

            <LoadingSpinnerScreen
                open={openLoadingSpinner}
            />

        </>
    );
};