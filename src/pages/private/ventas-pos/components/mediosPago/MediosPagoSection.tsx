import React, { useEffect, useState } from "react";
import {
    Alert,
    Button,
    Card,
    CardContent,
    Divider,
    IconButton,
    MenuItem,
    Select,
    Typography,
    TextField,
} from "@mui/material";
import {
    IoAdd,
    IoTrashOutline,
} from "react-icons/io5";
import { NumericFormat } from "react-number-format";

import { MedioPago } from "../../../../../interfaces/pos.interface";
import { obtenerMediosPago } from "../../../../../actions/pos/pos";

interface MediosPagoSectionProps {
    mediosPago: MedioPago[];
    totalPagado: number;
    restante: number;
    excedente: number;

    onAgregarMedioPago: () => void;

    onEliminarMedioPago: (
        id: number
    ) => void;

    onActualizarMedioPago: (
        id: number,
        campo: "nombre" | "valor",
        valor: string | number
    ) => void;

    onGuardar: () => void;

    formatMoney: (value: number) => string;

    productosLength: number;
}

export const MediosPagoSection = ({
    mediosPago,
    totalPagado,
    excedente,
    restante,
    onAgregarMedioPago,
    onEliminarMedioPago,
    onActualizarMedioPago,
    onGuardar,
    formatMoney,
    productosLength,
}: MediosPagoSectionProps) => {

    const [mediosPagoDisponibles, setMediosPagoDisponibles] = useState<MedioPago[]>([])
    useEffect(() => {
      cargarMedioPago()
    }, [])

    const cargarMedioPago=async ()=> {
        try {
            const mediosPagoResponse = await obtenerMediosPago()
            setMediosPagoDisponibles(mediosPagoResponse?.metodosPago || [])
        } catch (error) {
            
        }
    }
    
    return (
        <Card>
            <CardContent>
                {/* HEADER */}

                <div className="mb-4 flex items-center justify-between">
                    <Typography
                        variant="h6"
                        fontWeight={700}
                    >
                        Medios de pago
                    </Typography>

                    <Button
                        size="small"
                        variant="outlined"
                        startIcon={<IoAdd size={18} />}
                        onClick={onAgregarMedioPago}
                    >
                        Agregar
                    </Button>
                </div>

                {/* MEDIOS */}

                <div className="space-y-3">
                    {mediosPago.map((medio) => (
                        <div
                            key={medio.id_metodo_pago}
                            className="flex gap-2"
                        >
                            <Select
                                size="small"
                                value={medio.nombre}
                                onChange={(event) =>
                                    onActualizarMedioPago(
                                        medio.id_metodo_pago,
                                        "nombre",
                                        event.target.value
                                    )
                                }
                                className="min-w-0 flex-1"
                            >
                                {mediosPagoDisponibles.map(
                                    (opcion) => (
                                        <MenuItem
                                            key={opcion.id_metodo_pago}
                                            value={opcion.valor}
                                        >
                                            {opcion.nombre}
                                        </MenuItem>
                                    )
                                )}
                            </Select>

                            <NumericFormat
                                customInput={TextField}
                                size="small"
                                value={
                                    medio.valor || ""
                                }
                                thousandSeparator="."
                                decimalSeparator=","
                                prefix="$ "
                                allowNegative={false}
                                decimalScale={0}
                                className="w-40"
                                placeholder="$ 0"
                                onValueChange={(values) => {
                                    onActualizarMedioPago(
                                        medio.id_metodo_pago,
                                        "valor",
                                        values.floatValue ?? 0
                                    );
                                }}
                            />

                            <IconButton
                                color="error"
                                onClick={() =>onEliminarMedioPago(medio.id_metodo_pago)}
                                disabled={mediosPago.length ===1}
                            >
                                <IoTrashOutline
                                    size={20}
                                />
                            </IconButton>
                        </div>
                    ))}
                </div>

                <Divider className="my-4" />

                {/* TOTALES */}

                <div className="space-y-2">
                    <div className="flex justify-between">
                        <span>Total pagado</span>
                        <strong>{formatMoney(totalPagado)}</strong>
                    </div>

                    {restante > 0 && (
                        <div className="flex justify-between text-lg text-red-600">
                            <span>Restante por pagar</span>
                            <strong>{formatMoney(restante)}</strong>
                        </div>
                    )}

                    {excedente > 0 && (
                        <div className="flex justify-between text-lg text-green-600">
                            <span>Excedente / cambio</span>
                            <strong>{formatMoney(excedente)}</strong>
                        </div>
                    )}

                    {restante === 0 && excedente === 0 && (
                        <div className="flex justify-between text-lg text-green-600">
                            <span>Estado</span>
                            <strong>Pago completo</strong>
                        </div>
                    )}
                </div>

                {/* GUARDAR */}

                <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    className="mt-5"
                    onClick={onGuardar}
                    disabled={productosLength === 0}
                    color={restante > 0 ? "warning" : "primary"}
                >
                    {restante > 0
                        ? "Guardar venta con saldo"
                        : "Guardar venta"}
                </Button>
            </CardContent>
        </Card>
    );
};