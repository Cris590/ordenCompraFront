import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Checkbox,
    FormControl,
    InputLabel,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Select,
    TextField,
    Typography,
} from "@mui/material";

import {
    IoCalendarOutline,
    IoPersonOutline,
    IoStorefrontOutline,
} from "react-icons/io5";

import Swal from "sweetalert2";

import {
    obtenerTiendasPosUsuario,
    obtenerVendedoresCrm,
} from "../../../../actions/pos/pos";

import { IFiltroLogInventarios, IVendedorCrm } from "../../../../interfaces/pos.interface";

interface FiltrosLogInventariosProps {
    filtros: IFiltroLogInventarios;
    onFiltrar: (nuevosFiltros: IFiltroLogInventarios) => void;
}

export const FiltroLogInventarios = ({
    filtros,
    onFiltrar,
}: FiltrosLogInventariosProps) => {

    const [filtrosLocal, setFiltrosLocal] =
        useState<IFiltroLogInventarios>(filtros);

    const [tiendas, setTiendas] = useState<
        { id: number; nombre: string }[]
    >([]);

   

    /*
     * ============================================================
     * CARGAR BODEGAS Y USUARIOS
     * ============================================================
     */

    useEffect(() => {
        cargarTiendas();
    }, []);

    /*
     * Mantener sincronizado el filtro local
     */

    useEffect(() => {
        setFiltrosLocal(filtros);
    }, [filtros]);

    /*
     * ============================================================
     * BODEGAS
     * ============================================================
     */

    const cargarTiendas = async () => {
        try {

            const res = await obtenerTiendasPosUsuario();

            if (res?.error) {
                Swal.fire(res.msg);
                return;
            }

            setTiendas(res?.bodegas || []);

            /*
             * Si el usuario tiene una tienda obligatoria,
             * dejamos esa tienda seleccionada.
             */

            if (res?.idTiendaObligatorio) {

                setFiltrosLocal((actual) => ({
                    ...actual,
                    id_tienda: [Number(res.idTiendaObligatorio)],
                }));

            }

        } catch (error) {

            Swal.fire({
                icon: "error",
                text: "Comuniquese con el administrador",
            });

        }
    };

    

    /*
     * ============================================================
     * CAMBIAR FILTRO
     * ============================================================
     */

    const handleChange = (
        campo: keyof IFiltroLogInventarios,
        valor: string | number[]
    ) => {

        setFiltrosLocal((actual) => ({
            ...actual,
            [campo]: valor,
        }));

    };

    /*
     * ============================================================
     * FILTRAR
     * ============================================================
     */

    const handleFiltrar = () => {

        onFiltrar(filtrosLocal);

    };

    return (
        <Box className="border-b border-slate-200 p-5">

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5 xl:items-end">

                {/* ================================================= */}
                {/* BODEGA */}
                {/* ================================================= */}

                <div className="mt-5">


                    <FormControl
                        fullWidth
                        size="small"
                    >

                        <InputLabel>
                            Bodegas
                        </InputLabel>

                        <Select
                            multiple
                            value={filtrosLocal.id_tienda || []}
                            onChange={(event) => {

                                const value = event.target.value;

                                handleChange(
                                    "id_tienda",
                                    typeof value === "string"
                                        ? value.split(",").map(Number)
                                        : value.map(Number)
                                );

                            }}
                            input={<OutlinedInput label="Bodegas" />}
                            renderValue={(selected) => {

                                if (!selected.length) {
                                    return "Todas";
                                }

                                return tiendas
                                    .filter((tienda) =>
                                        selected.includes(tienda.id)
                                    )
                                    .map((tienda) => tienda.nombre)
                                    .join(", ");

                            }}
                            startAdornment={
                                <IoStorefrontOutline
                                    size={18}
                                    className="mr-2 text-slate-500"
                                />
                            }
                        >

                            {tiendas.map((tienda) => (

                                <MenuItem
                                    key={tienda.id}
                                    value={tienda.id}
                                >

                                    <Checkbox
                                        checked={
                                            filtrosLocal.id_tienda?.includes(
                                                tienda.id
                                            ) || false
                                        }
                                    />

                                    <ListItemText
                                        primary={tienda.nombre}
                                    />

                                </MenuItem>

                            ))}

                        </Select>

                    </FormControl>

                </div>

                {/* ================================================= */}
                {/* FECHA INICIAL */}
                {/* ================================================= */}

                <div>

                    <Typography
                        variant="body2"
                        fontWeight={700}
                        className="mb-1"
                    >
                        Fecha inicial
                    </Typography>

                    <TextField
                        type="date"
                        size="small"
                        fullWidth
                        value={filtrosLocal.fecha_inicial}
                        onChange={(event) =>
                            handleChange(
                                "fecha_inicial",
                                event.target.value
                            )
                        }
                        InputProps={{
                            startAdornment: (
                                <IoCalendarOutline
                                    size={18}
                                    className="mr-2 text-slate-500"
                                />
                            ),
                        }}
                    />

                </div>

                {/* ================================================= */}
                {/* FECHA FINAL */}
                {/* ================================================= */}

                <div>

                    <Typography
                        variant="body2"
                        fontWeight={700}
                        className="mb-1"
                    >
                        Fecha final
                    </Typography>

                    <TextField
                        type="date"
                        size="small"
                        fullWidth
                        value={filtrosLocal.fecha_final}
                        onChange={(event) =>
                            handleChange(
                                "fecha_final",
                                event.target.value
                            )
                        }
                        InputProps={{
                            startAdornment: (
                                <IoCalendarOutline
                                    size={18}
                                    className="mr-2 text-slate-500"
                                />
                            ),
                        }}
                    />

                </div>

                {/* ================================================= */}
                {/* BOTÓN */}
                {/* ================================================= */}

            <div className="mt-5">
                <Button
                    variant="contained"
                    fullWidth
                    size="medium"
                    onClick={handleFiltrar}
                    className="h-10 "
                >
                    Filtrar inventarios
                </Button>
                </div>

            </div>

        </Box>
    );
};