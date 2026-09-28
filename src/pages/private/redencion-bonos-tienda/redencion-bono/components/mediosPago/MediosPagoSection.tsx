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
import { MedioPago } from "../../../../../../interfaces/pos.interface";
import { obtenerMediosPago } from "../../../../../../actions/pos/pos";
import { IBonoDisponible } from "../../../../../../interfaces/entidad_bonos.interface";


interface MediosPagoSectionProps {
    bonos: IBonoDisponible[];
    bonosSeleccionados: IBonoDisponible[];
    onActualizarBonos: (bonos: IBonoDisponible[]) => void;

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
        campo:
            | "id_metodo_pago"
            | "nombre"
            | "valor"
            | "codigo"
            | "codigo_transaccion"
            | "necesita_codigo",
        valor: string | number
    ) => void;

    onGuardar: () => void;

    formatMoney: (
        value: number
    ) => string;

    productosLength: number;
    mediosPagoDisponibles: MedioPago[]
}

export const MediosPagoSection = ({
    bonos,
    bonosSeleccionados,
    onActualizarBonos,
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
    mediosPagoDisponibles
}: MediosPagoSectionProps) => {
    

    const handleOnChangeSectMEdioPago = (
        event: any,
        medio: MedioPago
    ) => {
        
        const idMetodoPago = event.target.value;
        
        const seleccionado = mediosPagoDisponibles.find((opcion) =>opcion.id_metodo_pago === idMetodoPago);
        
        onActualizarMedioPago(
            medio.id_metodo_pago,
            "id_metodo_pago",
            seleccionado?.id_metodo_pago || medio.id_metodo_pago
        );

        onActualizarMedioPago(
            medio.id_metodo_pago,
            "nombre",
            seleccionado?.nombre || medio.nombre
        );

        onActualizarMedioPago(
            medio.id_metodo_pago,
            "codigo",
            Number(seleccionado?.codigo || 0)
        );

        if (
            Number(seleccionado?.codigo || 0) === 0
        ) {
            onActualizarMedioPago(
                medio.id_metodo_pago,
                "codigo_transaccion",
                ""
            );
        }

        onActualizarMedioPago(
            medio.id_metodo_pago,
            "necesita_codigo",
            seleccionado?.necesita_codigo || "0"
        );
    };

    const seleccionarBono = (
        bono: IBonoDisponible
    ) => {

        if (
            bonosSeleccionados.some(
                (item) =>
                    item.cod_usuario_bono_entrega ===
                    bono.cod_usuario_bono_entrega
            )
        ) {
            return;
        }

        onActualizarBonos([
            ...bonosSeleccionados,
            bono,
        ]);
    };

    const eliminarBono = (cod_usuario_bono_entrega: number) => {

        onActualizarBonos(
            bonosSeleccionados.filter(
                (bono) =>
                    bono.cod_usuario_bono_entrega !==
                    cod_usuario_bono_entrega
            )
        );
    };

    const hayBonoSeleccionado = bonosSeleccionados.length > 0;

    const puedeGuardar = productosLength > 0 && hayBonoSeleccionado && restante === 0 && !mediosPago.some((medio)=>medio.id_metodo_pago === 0);

    return (
        <Card>
              {/* <pre className="text-xs bg-gray-100 p-4 rounded-lg overflow-auto">
                {JSON.stringify(mediosPago, null, 2)}
            </pre>

            <pre className="text-xs bg-gray-100 p-4 rounded-lg overflow-auto">
                {JSON.stringify(mediosPagoDisponibles, null, 2)}
            </pre> */}

            
            <CardContent>

                {/* ========================= */}
                {/* BONOS */}
                {/* ========================= */}

                <div className="mb-6">

                    <Typography
                        variant="h6"
                        fontWeight={700}
                    >
                        Bonos
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        className="mb-3"
                    >
                        Selecciona los bonos que deseas utilizar.
                    </Typography>

                    <Select
                        fullWidth
                        size="small"
                        value=""
                        displayEmpty
                        onChange={(event) => {

                            const bono = bonos.find((item) => item.cod_usuario_bono_entrega === Number(event.target.value));
                            if (bono) {
                                seleccionarBono(bono);
                            }
                        }}
                    >

                        <MenuItem value="" disabled>
                            Seleccionar bono
                        </MenuItem>

                        {bonos.filter((bono) =>!bonosSeleccionados.some((seleccionado) =>seleccionado.cod_usuario_bono_entrega === bono.cod_usuario_bono_entrega))
                            .map((bono) => (

                                <MenuItem
                                    key={ bono.cod_usuario_bono_entrega }
                                    value={ bono.cod_usuario_bono_entrega }
                                >
                                    {bono.codigo_bono} -{" "}
                                    {formatMoney(bono.valor)}
                                </MenuItem>

                            ))}

                    </Select>

                    {/* BONOS SELECCIONADOS */}

                    {bonosSeleccionados.length > 0 && (

                        <div className="mt-3 space-y-2">

                            {bonosSeleccionados.map(
                                (bono) => (

                                    <div
                                        key={bono.cod_usuario_bono_entrega}
                                        className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3"
                                    >

                                        <div>

                                            <Typography
                                                variant="body2"
                                                fontWeight={600}
                                            >
                                                {bono.codigo_bono}
                                            </Typography>

                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                            >
                                                {bono.descripcion}
                                            </Typography>

                                        </div>

                                        <div className="flex items-center gap-2">

                                            <strong>
                                                {formatMoney(bono.valor)}
                                            </strong>

                                            <IconButton
                                                color="error"
                                                size="small"
                                                onClick={() =>eliminarBono(bono.cod_usuario_bono_entrega)}
                                            >
                                                <IoTrashOutline size={18} />
                                            </IconButton>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </div>


                {/* ========================= */}
                {/* MEDIOS DE PAGO */}
                {/* ========================= */}

                {(hayBonoSeleccionado) && (

                    <>
                        <Divider className="mt-4" />

                        <div className="my-4 flex items-center justify-between">

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

                            {
                                restante > 0 &&
                                <Button
                                    size="small"
                                    variant="outlined"
                                    startIcon={ <IoAdd size={18} /> }
                                    onClick={ onAgregarMedioPago }
                                >
                                    Agregar
                                </Button>
                            }


                        </div>


                        <div className="space-y-3">

                            {mediosPago.map(
                                (medio) => {

                                    const requiereCodigo = Number( medio.necesita_codigo) === 1;

                                    return (

                                        <div key={ medio.id_metodo_pago } className="rounded-lg border border-slate-200 bg-slate-50 p-3">

                                            <div className="flex gap-2">

                                                {/* MEDIO */}

                                                <Select
                                                    size="small"
                                                    value={medio.id_metodo_pago ||""}
                                                    disabled={medio.id_metodo_pago !== 0}
                                                    displayEmpty
                                                    onChange={(event) => handleOnChangeSectMEdioPago(event,medio) }
                                                    className="min-w-0 flex-1"
                                                >

                                                    <MenuItem value="" disabled>
                                                        Seleccionar medio
                                                    </MenuItem>

                                                    {mediosPagoDisponibles.filter(
                                                            (opcion) => { 

                                                                const usadoPorOtraFila = mediosPago.some((otroMedio) =>
                                                                            otroMedio.id_metodo_pago === opcion.id_metodo_pago &&
                                                                            otroMedio.id_metodo_pago !== medio.id_metodo_pago
                                                                    );

                                                                return !usadoPorOtraFila;
                                                            }
                                                        )
                                                        .map((opcion) => (

                                                                <MenuItem
                                                                    key={ opcion.id_metodo_pago}
                                                                    value={opcion.id_metodo_pago}
                                                                >
                                                                    {opcion.nombre}
                                                                </MenuItem>

                                                            )
                                                        )}

                                                </Select>


                                                {/* VALOR */}

                                                <NumericFormat
                                                    customInput={TextField}
                                                    size="small"
                                                    disabled={medio.id_metodo_pago === 0 }
                                                    value={medio.valor ||""}
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
                                                            values.floatValue ??
                                                            0
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

                                                >
                                                    <IoTrashOutline
                                                        size={20}
                                                    />
                                                </IconButton>

                                            </div>


                                            {/* CÓDIGO DE TRANSACCIÓN */}

                                            {requiereCodigo && (

                                                <div className="mt-2">

                                                    <TextField
                                                        fullWidth
                                                        size="small"
                                                        className="my-2"
                                                        label="Código de transacción"
                                                        placeholder="Ingrese el código de transacción"
                                                        value={
                                                            medio.codigo_transaccion ||
                                                            ""
                                                        }
                                                        onChange={(
                                                            event
                                                        ) =>
                                                            onActualizarMedioPago(
                                                                medio.id_metodo_pago,
                                                                "codigo_transaccion",
                                                                event.target.value
                                                            )
                                                        }
                                                        inputProps={{
                                                            maxLength: 50,
                                                        }}
                                                    />

                                                </div>

                                            )}

                                        </div>

                                    );
                                }
                            )}

                        </div>

                    </>
                )}


                <Divider className="my-4" />


                {/* ========================= */}
                {/* TOTALES */}
                {/* ========================= */}

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
                                {formatMoney(
                                    restante
                                )}
                            </strong>

                        </div>

                    )}


                    {excedente > 0 && (

                        <div className="flex justify-between text-lg text-green-600">

                            <span>
                                Excedente / cambio
                            </span>

                            <strong>
                                {formatMoney(
                                    excedente
                                )}
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


                {/* ========================= */}
                {/* GUARDAR */}
                {/* ========================= */}

                <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    className="mt-5"
                    onClick={onGuardar}
                    disabled={!puedeGuardar}
                    color="primary"
                >
                    Guardar venta Bono
                </Button>

            </CardContent>
        </Card>
    );
};
