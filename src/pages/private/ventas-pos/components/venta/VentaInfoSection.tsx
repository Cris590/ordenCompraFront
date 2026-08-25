import React from "react";
import {
    Card,
    CardContent,
    Typography,
} from "@mui/material";
import { IoPeopleOutline } from "react-icons/io5";

import { Cliente, IVendedorCrmTienda, Vendedor } from "../../../../../interfaces/pos.interface";

import { ClienteSection } from "../cliente/ClienteSection";
import { VendedorSection } from "../vendedor/VendedorSection";

interface VentaInfoSectionProps {
    documento: string;
    cliente: Cliente | null;
    codigoNuevo:number,
    vendedores: IVendedorCrmTienda[];
    vendedor: IVendedorCrmTienda | null;

    onDocumentoChange: (documento: string) => void;

    onDocumentoBlur: (documento:string) => void;
    onCrearCliente: () => void;
    onVendedorChange: (vendedorId: number) => void;
    documentoRef: React.RefObject<HTMLInputElement>;
}

export const VentaInfoSection = ({
    documento,
    cliente,
    codigoNuevo,
    vendedores,
    vendedor,
    onDocumentoChange,
    onDocumentoBlur,
    onCrearCliente,
    onVendedorChange,
    documentoRef
}: VentaInfoSectionProps) => {
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
                        <ClienteSection
                            documentoRef={documentoRef}
                            documento={documento}
                            cliente={cliente}
                            onDocumentoChange={onDocumentoChange}
                            onDocumentoBlur={onDocumentoBlur}
                            onCrearCliente={onCrearCliente}
                        />
                    </div>

                    {/* VENDEDOR */}
                    <div className="w-full lg:w-[340px]">
                        <VendedorSection
                            vendedores={vendedores}
                            vendedor={vendedor}
                            codigoNuevo={codigoNuevo}
                            onVendedorChange={onVendedorChange}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};