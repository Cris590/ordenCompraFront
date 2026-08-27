import React, { useEffect, useState } from "react";
import {
    Button,
    Card,
    CardContent,
    Divider,
    IconButton,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@mui/material";

import {
    IoAdd,
    IoTrashOutline,
} from "react-icons/io5";

import { NumericFormat } from "react-number-format";

import {
    MedioPago,
} from "../../../../../interfaces/pos.interface";

import {
    obtenerMediosPago,
} from "../../../../../actions/pos/pos";

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
        campo: "nombre" | "valor" | "codigo" | "codigo_transaccion",
        valor: string | number
    ) => void;

    onGuardar: () => void;

    formatMoney: (
        value: number
    ) => string;

    productosLength: number;
}

export const MediosPagoSection = ({
    mediosPago,
    totalPagado,
    restante,
    excedente,
    onAgregarMedioPago,
    onEliminarMedioPago,
    onActualizarMedioPago,
    onGuardar,
    formatMoney,
    productosLength,
}: MediosPagoSectionProps) => {

    const [
        mediosPagoDisponibles,
        setMediosPagoDisponibles
    ] = useState<MedioPago[]>([]);

    useEffect(() => {
        cargarMediosPago();
    }, []);

    const cargarMediosPago = async () => {
        try {
            const response = await obtenerMediosPago();

            setMediosPagoDisponibles(
                response?.metodosPago || []
            );

        } catch (error) {
            console.error(
                "Error cargando medios de pago:",
                error
            );
        }
    };

    return (
        <Card>
            <CardContent>

                {/* HEADER */}

                <div className="mb-4 flex items-center justify-between">

                    <div>
                        <Typography
                            variant="h6"
                            fontWeight={700}
                        >
                            Medios de pago
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Puedes agregar más de un medio de pago.
                        </Typography>
                    </div>

                    <Button
                        size="small"
                        variant="outlined"
                        startIcon={
                            <IoAdd size={18} />
                        }
                        onClick={
                            onAgregarMedioPago
                        }
                    >
                        Agregar
                    </Button>

                </div>

                {/* MEDIOS DE PAGO */}

                <div className="space-y-3">

                    {mediosPago.map((medio) => {

                        /*
                         * codigo = 1
                         * significa que el medio requiere
                         * código de transacción.
                         */

                        const requiereCodigo =
                            Number(medio.codigo) === 1;

                        return (
                            <div
                                key={
                                    medio.id_metodo_pago
                                }
                                className="rounded-lg border border-slate-200 bg-slate-50 p-3"
                            >

                                <div className="flex gap-2">

                                    {/* MEDIO */}

                                    <Select
                                        size="small"
                                        value={medio.nombre || ""}
                                        displayEmpty
                                        onChange={(event) => {
                                            const nombreSeleccionado = event.target.value;

                                            const seleccionado =mediosPagoDisponibles.find((opcion) =>opcion.nombre === nombreSeleccionado);

                                            onActualizarMedioPago(
                                                medio.id_metodo_pago,
                                                "nombre",
                                                nombreSeleccionado
                                            );

                                            onActualizarMedioPago(
                                                medio.id_metodo_pago,
                                                "codigo",
                                                Number(seleccionado?.codigo || 0)
                                            );

                                            if (Number(seleccionado?.codigo || 0) === 0 ) {
                                                onActualizarMedioPago(
                                                    medio.id_metodo_pago,
                                                    "codigo_transaccion",
                                                    ""
                                                );
                                            }
                                        }}
                                        className="min-w-0 flex-1"
                                    >
                                        <MenuItem value="" disabled>
                                            Seleccionar medio
                                        </MenuItem>

                                        {mediosPagoDisponibles.map((opcion) => (
                                            <MenuItem
                                                key={opcion.id_metodo_pago}
                                                value={opcion.nombre}
                                            >
                                                {opcion.nombre}
                                            </MenuItem>
                                        ))}
                                    </Select>

                                    {/* VALOR */}

                                    <NumericFormat
                                        customInput={TextField}
                                        size="small"
                                        value={medio.valor || ""}
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

                                    {/* ELIMINAR */}

                                    <IconButton
                                        color="error"
                                        onClick={() =>
                                            onEliminarMedioPago(
                                                medio.id_metodo_pago
                                            )
                                        }
                                        disabled={mediosPago.length === 1}
                                    >
                                        <IoTrashOutline size={20} />
                                    </IconButton>

                                </div>

                                {/* CÓDIGO DE TRANSACCIÓN */}

                                {requiereCodigo && (

                                    <div className="mt-2">

                                        <TextField
                                            fullWidth
                                            size="small"
                                            label="Código de transacción"
                                            placeholder="Ingrese el código de transacción"
                                            value={ medio.codigo_transaccion || ""}
                                            onChange={(event) =>
                                                onActualizarMedioPago(
                                                    medio.id_metodo_pago,
                                                    "codigo_transaccion",
                                                    event.target.value
                                                )
                                            }
                                            inputProps={{maxLength: 50}}
                                        />

                                    </div>

                                )}

                            </div>
                        );
                    })}

                </div>

                <Divider className="my-4" />

                {/* TOTALES */}

                <div className="space-y-2">

                    <div className="flex justify-between">
                        <span>
                            Total pagado
                        </span>

                        <strong>
                            {formatMoney(
                                totalPagado
                            )}
                        </strong>
                    </div>

                    {restante > 0 && (

                        <div className="flex justify-between text-lg text-red-600">

                            <span>
                                Restante por pagar
                            </span>

                            <strong>
                                {formatMoney(restante)}
                            </strong>

                        </div>

                    )}

                    {excedente > 0 && (

                        <div className="flex justify-between text-lg text-green-600">

                            <span>
                                Excedente / cambio
                            </span>

                            <strong>
                                {formatMoney(excedente)}
                            </strong>

                        </div>

                    )}

                    {restante === 0 &&
                        excedente === 0 && (

                            <div className="flex justify-between text-lg text-green-600">

                                <span>
                                    Estado
                                </span>

                                <strong>
                                    Pago completo
                                </strong>

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
                    color={restante > 0 ? "warning":"primary"}
                >
                    {restante > 0 ? "Guardar venta con saldo" : "Guardar venta"}
                </Button>

            </CardContent>
        </Card>
    );
};