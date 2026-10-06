import React from "react";
import {
    Card,
    CardContent,
    Typography,
} from "@mui/material";
import { IoPeopleOutline } from "react-icons/io5";


import { ClienteSectionBono } from "../cliente/ClienteSection";
import { EntidadSection } from "../entidad/EntidadSection";
import { VendedorSection } from "../vendedor/VendedorSection";
import { IVendedorCrmTienda } from "../../../../../../interfaces/pos.interface";

interface BonoRedencionSectionProps {
    documento: string;
    nombre_cliente: string;
    entidad: string,
    no_contrato: string,
    vendedores: IVendedorCrmTienda[];
    vendedor: IVendedorCrmTienda | null;
    onVendedorChange: (vendedorId: number) => void;
}

export const BonoRedencionSection = ({
    documento,
    nombre_cliente,
    entidad,
    no_contrato,
    vendedores,
    vendedor,
    onVendedorChange
}: BonoRedencionSectionProps) => {
    return (
        <Card className="mb-4">
            <CardContent>
                <div className="mb-4 flex items-center gap-2">
                    <Typography
                        variant="h6"
                        fontWeight={700}
                    >
                        Información de la venta
                    </Typography>

                    <IoPeopleOutline
                        size={22}
                        className="text-slate-500"
                    />
                </div>

                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-start">
                    {/* CLIENTE */}
                    <div className="w-full lg:w-[620px]">
                        <ClienteSectionBono
                            documento={documento}
                            nombre_cliente={nombre_cliente}
                        />
                    </div>

                    {/* No contrato */}
                    <div className="w-full lg:w-[640px]">
                        <EntidadSection
                            entidad={entidad}
                            no_contrato={no_contrato}
                        />
                    </div>

                </div>

                <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-start mt-4">
                    <div className="w-full lg:w-[620px]">


                        <VendedorSection
                            vendedores={vendedores}
                            vendedor={vendedor}
                            onVendedorChange={onVendedorChange}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};