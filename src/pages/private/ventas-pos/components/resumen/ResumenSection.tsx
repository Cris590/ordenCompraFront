import React from "react";
import {
    Card,
    CardContent,
    Divider,
    Typography,
} from "@mui/material";

interface ResumenSectionProps {
    subtotal: number;
    valorDescuento: number;
    total: number;
    neto:number;
    impuesto:number;
    formatMoney: (value: number) => string;
}

export const ResumenSection = ({
    subtotal,
    valorDescuento,
    total,
    neto,
    impuesto,
    formatMoney,
}: ResumenSectionProps) => {
    return (
        <Card>
            <CardContent>
                <Typography
                    variant="h6"
                    fontWeight={700}
                >
                    Resumen
                </Typography>

                <div className="mt-4 space-y-3">
                    <div className="flex justify-between">
                        <span>Subtotal</span>
                        <strong>{formatMoney(subtotal)}</strong>
                    </div>

                    <div className="flex justify-between">
                        <span>Descuento</span>
                        <strong>
                            - {formatMoney(valorDescuento)}
                        </strong>
                    </div>

                    <div className="flex justify-between">
                        <span>Neto</span>
                        <strong>{formatMoney(neto)}</strong>
                    </div>

                    <div className="flex justify-between">
                        <span>IVA (19%)</span>
                        <strong>{formatMoney(impuesto)}</strong>
                    </div>

                    <Divider />

                    <div className="flex justify-between text-xl">
                        <span className="font-bold">Total</span>
                        <strong>{formatMoney(total)}</strong>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};