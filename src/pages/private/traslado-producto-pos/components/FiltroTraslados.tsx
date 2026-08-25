import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Checkbox,
    ListItemText,
    MenuItem,
    TextField,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import {
    IoStorefrontOutline,
    IoSwapHorizontalOutline,
} from "react-icons/io5";
import { FiFilter } from "react-icons/fi";
import { FiPackage } from "react-icons/fi";
import Swal from "sweetalert2";

import { obtenerTiendasPosUsuario } from "../../../../actions/pos/pos";
import { IFiltroTrasladosProductos } from "../../../../interfaces/pos.interface";

interface Props {
    filtros: IFiltroTrasladosProductos;
    onNuevoTraslado: () => void;
    onFiltrar: (filtros: IFiltroTrasladosProductos) => void;
}

export const FiltroTraslados = ({
    filtros,
    onFiltrar,
    onNuevoTraslado,
}: Props) => {
    const { control, handleSubmit, setValue } = useForm<IFiltroTrasladosProductos>({
        defaultValues: filtros,
    });

    const [bodegas, setBodegas] = useState<
        { id: number; nombre: string }[]
    >([]);

    const [tiendaVendedor, setTiendaVendedor] = useState(0);

    useEffect(() => {
        obtenerBodegas();
    }, []);

    const obtenerBodegas = async () => {
        try {
            const res = await obtenerTiendasPosUsuario();

            if (res?.error) {
                Swal.fire(res.msg);
                return;
            }

            setBodegas(res?.bodegas || []);

            if (res?.idTiendaObligatorio) {
                const idTienda = Number(res.idTiendaObligatorio);

                setTiendaVendedor(idTienda);

                // Seleccionamos automáticamente la bodega
                setValue("id_bodega_salida", [idTienda]);
            }
        } catch {
            Swal.fire({
                icon: "error",
                text: "Comuniquese con el administrador",
            });
        }
    };

    const onSubmit = (data: IFiltroTrasladosProductos) => {
        onFiltrar(data);
    };

    return (
        <Box className="border-b border-slate-200 bg-white px-5 py-4">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">

                    {/* FECHA INICIAL */}
                    <Controller
                        name="fecha_inicial"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                type="date"
                                size="small"
                                fullWidth
                                label="Fecha inicio"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        )}
                    />

                    {/* FECHA FINAL */}
                    <Controller
                        name="fecha_final"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                type="date"
                                size="small"
                                fullWidth
                                label="Fecha final"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        )}
                    />

                    {/* BODEGA SALIDA */}
                    <Controller
                        name="id_bodega_salida"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                select
                                size="small"
                                fullWidth
                                label="Bodega salida"
                                disabled={tiendaVendedor !== 0}
                                value={field.value || []}
                                onChange={(e) => {
                                    const value = e.target.value;

                                    field.onChange(
                                        typeof value === "string"
                                            ? value.split(",").map(Number)
                                            : value
                                    );
                                }}
                                SelectProps={{
                                    multiple: true,
                                    displayEmpty: true,
                                    renderValue: (selected) => {
                                        const ids = selected as number[];

                                        if (!ids.length) {
                                            return (
                                                <span className="text-slate-400">
                                                    Seleccione tienda
                                                </span>
                                            );
                                        }

                                        return bodegas
                                            .filter((bodega) =>
                                                ids.includes(bodega.id)
                                            )
                                            .map((bodega) => bodega.nombre)
                                            .join(", ");
                                    },
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <IoStorefrontOutline
                                            size={18}
                                            className="mr-2 text-slate-500"
                                        />
                                    ),
                                }}
                            >
                                {bodegas.map((bodega) => (
                                    <MenuItem
                                        key={bodega.id}
                                        value={bodega.id}
                                    >
                                        <Checkbox
                                            size="small"
                                            checked={field.value?.includes(
                                                bodega.id
                                            )}
                                        />

                                        <ListItemText
                                            primary={bodega.nombre}
                                        />
                                    </MenuItem>
                                ))}
                            </TextField>
                        )}
                    />

                    {/* BODEGA ENTRADA */}
                    <Controller
                        name="id_bodega_entrada"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                select
                                size="small"
                                fullWidth
                                label="Bodega entrada"
                                value={field.value || []}
                                onChange={(e) => {
                                    const value = e.target.value;

                                    field.onChange(
                                        typeof value === "string"
                                            ? value
                                                .split(",")
                                                .map(Number)
                                            : value
                                    );
                                }}
                                SelectProps={{
                                    multiple: true,
                                    displayEmpty: true,
                                    renderValue: (selected) => {
                                        const ids =
                                            selected as number[];

                                        if (!ids.length) {
                                            return (
                                                <span className="text-slate-400">
                                                    Seleccione tienda
                                                </span>
                                            );
                                        }

                                        return bodegas
                                            .filter((bodega) =>
                                                ids.includes(
                                                    bodega.id
                                                )
                                            )
                                            .map(
                                                (bodega) =>
                                                    bodega.nombre
                                            )
                                            .join(", ");
                                    },
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <IoStorefrontOutline
                                            size={18}
                                            className="mr-2 text-slate-500"
                                        />
                                    ),
                                }}
                            >
                                {bodegas.map((bodega) => (
                                    <MenuItem
                                        key={bodega.id}
                                        value={bodega.id}
                                    >
                                        <Checkbox
                                            size="small"
                                            checked={field.value.includes(
                                                bodega.id
                                            )}
                                        />

                                        <ListItemText
                                            primary={bodega.nombre}
                                        />
                                    </MenuItem>
                                ))}
                            </TextField>
                        )}
                    />

                    {/* CÓDIGO PRODUCTO */}
                    <Controller
                        name="codigo_producto"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                size="small"
                                fullWidth
                                label="Código producto"
                                placeholder="Escanear o ingresar código"
                                InputProps={{
                                    startAdornment: (
                                        <FiPackage
                                            size={18}
                                            className="mr-2 text-slate-500"
                                        />
                                    ),
                                }}
                            />
                        )}
                    />
                </div>

                {/* BOTONES */}
                <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
                    <Button
                        type="button"
                        variant="outlined"
                        onClick={onNuevoTraslado}
                        startIcon={
                            <IoSwapHorizontalOutline />
                        }
                        className="h-10"
                    >
                        Nuevo traslado
                    </Button>

                    <Button
                        type="submit"
                        variant="contained"
                        startIcon={<FiFilter />}
                        className="h-10 min-w-[180px]"
                    >
                        Filtrar traslados
                    </Button>
                </div>
            </form>
        </Box>
    );
};